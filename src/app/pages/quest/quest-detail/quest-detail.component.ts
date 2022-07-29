import {
  Component,
  Inject,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { RxState } from '@rx-angular/state';
import { DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';
import { BsModalService } from 'ngx-bootstrap/modal';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  BehaviorSubject,
  filter,
  forkJoin,
  map,
  Observable,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';
import {
  PagingMetadata,
  QuestItemListItem,
  QuestItemListSearch,
  QuestItemType,
  QuestListItem,
  Comment,
  SearchInfo,
} from 'src/app/models';
import {
  AreaService,
  CommentService,
  QuestItemService,
  QuestItemTypeService,
  QuestService,
  QuestTypeService,
} from 'src/app/services';
import { PageInfo, SortInfo } from 'src/app/types';
import { DeleteModalComponent, SuggestionModalComponent } from '../../share';
import { QuestItemListState } from '../states';
import { QuestDetailState } from '../states/questdetail.state';
import { QuestItemState, QUEST_ITEM_STATE } from './quest-item/states';
import { ImageModalComponent } from './image-modal/image-modal.component';
import { CommentListState } from './states';

interface QuestDetailDescription {
  showQuestDescription: boolean;
}

@Component({
  selector: 'app-quest-detail',
  templateUrl: './quest-detail.component.html',
  styleUrls: ['./quest-detail.component.scss'],
  providers: [RxState],
  encapsulation: ViewEncapsulation.None,
})
export class QuestDetailComponent implements OnInit {
  private id: string;
  listImages: string[] = [];
  constructor(
    @Inject(QUEST_ITEM_STATE) private questItemState: RxState<QuestItemState>,
    private readonly questItemTypeService: QuestItemTypeService,
    private questService: QuestService,
    private modalService: BsModalService,
    private questDetailState: RxState<QuestDetailState>,
    private toast: HotToastService,
    //QuestItem
    private questItemService: QuestItemService,
    private questItemListState: RxState<QuestItemListState>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private areaService: AreaService,
    private questTypeService: QuestTypeService,
    private modalService1: NgbModal,
    private state: RxState<QuestDetailDescription>,
    private commentListState: RxState<CommentListState>,
    private commentService: CommentService
  ) {}
  ngOnInit(): void {
    this.state.connect(this.toggleDescription$, (prev, _) => ({
      showQuestDescription: !prev.showQuestDescription,
    }));

    this.questItemState.connect(
      this.questItemTypeService.getQuestItemTypeIds(),
      (_, curr) => ({
        questItemTypeIds: curr,
      })
    );
    //Quest
    this.questDetailState.connect(
      this.activatedRoute.paramMap.pipe(
        tap((_) => this.questDetailState.set({ loading: true })),
        filter((p) => p.has('id')),
        map((p) => p.get('id')?.toString()),
        switchMap((id) => this.questService.getQuestById(id)),
        switchMap((data) =>
          forkJoin(
            [
              this.questService.getQuestById(data.id.toString()),
              this.areaService.getAreaById(data.areaId.toString()),
              this.questTypeService.getQuestTypeById(
                data.questTypeId.toString()
              ),
            ],
            (quest, area, questType) => {
              quest.areaName = area.name;
              quest.questTypeName = questType.name;
              return quest;
            }
          )
        )
      ),
      (_, result) => ({
        quest: result,
        loading: false,
      })
    );

    //QuestItem
    this.questItemListState.connect(
      this.activatedRoute.paramMap.pipe(
        tap((_) => this.questDetailState.set({ loading: true })),
        filter((p) => p.has('id')),
        map((p) => Number(p.get('id'))),
        switchMap((s) => {
          this.searchQuestItem$.next({ questId: s });
          localStorage.setItem('questId', s.toString());

          return this.questItemService.getQuestItemsByQuestId({ questId: s });
        })
      ),
      (_, result) => ({
        questitems: result.data,
        metadata: { ...result.pagination },
        loading: false,
      })
    );

    this.questItemListState.connect(
      this.searchQuestItem$.pipe(
        switchMap((s) => this.questItemService.getQuestItemsByQuestId(s))
      ),
      (_, result) => ({
        questitems: result.data,
        metadata: { ...result.pagination },
        loading: false,
      })
    );

    this.questItemListState.hold(this.submitSearch$, (form) => {
      this.searchQuestItem$.next({
        ...this.searchQuestItem$.getValue(),
        ...form,
        currentPage: 0,
      }),
        (this.table.offset = 0);
    });
    this.questItemListState.hold(this.resetSearch$, () => {
      var questId = localStorage.getItem('questId');
      this.searchForm.reset();
      this.searchQuestItem$.next({ currentPage: 0, questId: Number(questId) });
      this.table.offset = 0;
    });

    //Comment
    this.initTable();
    this.commentListState.connect(
      this.searchComment$.pipe(
        tap(() => this.commentListState.set({ loading: true })),
        switchMap((s) => this.commentService.getComment(s))
      ),
      (_, result) => ({
        comments: result.data,
        metadata: { ...result.pagination },
        loading: false,
      })
    );

    this.status = this.commentService.status;

    this.commentListState.hold(this.submitSearchComment$, (form) => {
      this.searchComment$.next({
        ...this.searchComment$.getValue(),
        ...form,
        currentPage: 0,
      }),
        (this.table.offset = 0);
    });

    this.commentListState.connect(this.resetSearchComment$, (prev, _) => ({
      metadata: { ...prev.metadata, currentPage: 0 },
    }));

    this.commentListState.hold(this.resetSearchComment$, () => {
      this.searchFormComment.reset();
      this.searchComment$.next({ currentPage: 0 });
      this.table.offset = 0;
    });
  }

  get quest$(): Observable<QuestListItem> {
    return this.questDetailState.select('quest');
  }

  @ViewChild('colCreatedAt', { static: true }) colCreatedAt!: TemplateRef<any>;
  @ViewChild('actionTemplate', { static: true })
  public actionTemplate: TemplateRef<any>;

  //Comment
  initTable() {
    this.columns = [
      {
        prop: 'name',
        name: 'Khách hàng',
        sortable: true,
        canAutoResize: true,
        width: 150,
      },
      {
        prop: 'feedBack',
        name: 'Nội dung phản hồi',
        sortable: true,
        canAutoResize: true,
        width: 300,
      },
      {
        prop: 'rating',
        name: 'Đánh giá',
        sortable: true,
        canAutoResize: true,
        width: 60,
        headerClass: 'd-flex justify-content-center',
        cellClass: 'd-flex justify-content-center',
      },
      {
        prop: 'createdDate',
        name: 'Ngày tạo',
        sortable: true,
        cellTemplate: this.colCreatedAt,
        canAutoResize: true,
        headerClass: 'd-flex justify-content-center',
        cellClass: 'd-flex justify-content-center',
        width: 60,
      },
      {
        prop: 'status',
        name: 'Trạng thái',
        sortable: true,
        width: 60,
        canAutoResize: true,
        headerClass: 'd-flex justify-content-center',
        cellClass: 'd-flex justify-content-center',
      },
      {
        prop: 'action',
        width: 60,
        name: 'Hành động',
        sortable: false,
        canAutoResize: true,
        cellTemplate: this.actionTemplate,
        headerClass: 'd-flex justify-content-center',
        cellClass: 'd-flex justify-content-center',
      },
    ];
  }

  onDelete(id: number) {
    const bsModalRef = this.modalService.show(DeleteModalComponent, {
      initialState: {
        id: id + '',
        title: 'Quest Item',
      },
    });
    bsModalRef.onHide?.pipe(take(1)).subscribe({
      next: (result) => {
        this.searchQuestItem$.next({
          ...this.searchQuestItem$.getValue(),
        });
      },
    });
  }

  onUpdateStatus(id: number, status: string) {
    const bsModalRef = this.modalService.show(DeleteModalComponent, {
      initialState: {
        id: id + '',
        title: 'Quest',
        status: status,
      },
    });
    bsModalRef.onHide
      ?.pipe(
        take(1),
        filter((s) => (s as any).data)
      )
      .subscribe({
        next: (result) => {
          setTimeout(() => window.location.reload(), 3000);
        },
      });
  }

  onUpdate(id: number) {
    this.router.navigate([`quest-item/${id}/edit`], {
      relativeTo: this.activatedRoute,
    });
  }

  get questItemTypeIds(): Observable<QuestItemType[]> {
    return this.questItemState.select('questItemTypeIds');
  }
  get questItems$(): Observable<QuestItemListItem[]> {
    return this.questItemListState.select('questitems');
  }

  get metadata$(): Observable<PagingMetadata> {
    return this.questItemListState.select('metadata');
  }
  get loading$(): Observable<boolean> {
    return this.questItemListState.select('loading');
  }

  onPage(paging: PageInfo) {
    this.searchComment$.next({
      ...this.searchComment$.getValue(),
      currentPage: paging.offset,
    });
  }
  onSort(event: SortInfo) {
    this.table.offset - 1;
    this.searchComment$.next({
      ...this.searchComment$.getValue(),
      sort: { sortBy: event.column.prop, dir: event.newValue },
    });
  }
  searchQuestItem$ = new BehaviorSubject<QuestItemListSearch>({});

  searchForm = new FormGroup({
    keyword: new FormControl(),
    questItemTypeIds: new FormControl(),
  });

  submitSearch$ = new Subject<Partial<{ keyword: string }>>();
  resetSearch$ = new Subject<void>();

  showAddSuggestion(questItemId: number) {
    const modalRef = this.modalService1.open(SuggestionModalComponent, {
      windowClass: 'my-class',
    });

    modalRef.componentInstance.questItemId = `${questItemId}`;
    modalRef.componentInstance.title = `gợi ý`;
    modalRef.componentInstance.type = `Tạo`;
  }

  editSuggestion(suggestionId: number) {
    const modalRef = this.modalService1.open(SuggestionModalComponent, {
      windowClass: 'my-class',
    });

    modalRef.componentInstance.id = `${suggestionId}`;
    modalRef.componentInstance.title = `gợi ý`;
    modalRef.componentInstance.type = `Sửa`;
  }

  showImage(questItemId: number) {
    const modalRef = this.modalService1.open(ImageModalComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.questItemId = `${questItemId}`;
  }

  toggleDescription$ = new Subject<void>();
  get description$(): Observable<QuestDetailDescription> {
    return this.state.select();
  }

  columns: TableColumn[] = [];
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  status: { id: string; value: string }[] = [];

  get comments$(): Observable<Comment[]> {
    return this.commentListState.select('comments');
  }

  get metadataComment$(): Observable<PagingMetadata> {
    return this.commentListState.select('metadata');
  }
  get loadingComment$(): Observable<boolean> {
    return this.commentListState.select('loading');
  }

  searchComment$ = new BehaviorSubject<SearchInfo>({});
  searchFormComment = new FormGroup({
    keyword: new FormControl(),
    status: new FormControl(),
  });

  submitSearchComment$ = new Subject<
    Partial<{ keyword: string; status: string }>
  >();
  resetSearchComment$ = new Subject<void>();
}
