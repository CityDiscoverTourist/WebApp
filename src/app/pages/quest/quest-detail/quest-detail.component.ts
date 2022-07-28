import {
  Component,
  Inject,
  OnInit,
  TemplateRef,
  ViewChild,
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
} from 'src/app/models';
import {
  AreaService,
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

interface QuestDetailDescription {
  showQuestDescription: boolean;
}

@Component({
  selector: 'app-quest-detail',
  templateUrl: './quest-detail.component.html',
  styleUrls: ['./quest-detail.component.scss'],
  providers: [RxState],
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
    private state: RxState<QuestDetailDescription>
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

    this.initTable();

    this.questItemListState.hold(this.submitSearch$, (form) => {
      this.searchQuestItem$.next({
        ...this.searchQuestItem$.getValue(),
        ...form,
        currentPage: 0,
      });
    });
    this.questItemListState.hold(this.resetSearch$, () => {
      this.searchForm.reset();
      this.searchQuestItem$.next({ currentPage: 0 });
    });
  }

  get quest$(): Observable<QuestListItem> {
    return this.questDetailState.select('quest');
  }

  @ViewChild('colCreatedAt', { static: true }) colCreatedAt!: TemplateRef<any>;
  @ViewChild('actionTemplate', { static: true })
  public actionTemplate: TemplateRef<any>;
  //QuestItem

  initTable() {
    this.columns = [
      {
        prop: 'index',
        name: 'STT',
        sortable: false,
        canAutoResize: true,
        maxWidth: 75,
      },
      {
        prop: 'content',
        name: 'Nội dung câu hỏi',
        sortable: true,
        canAutoResize: true,
      },
      {
        prop: 'rightAnswer',
        name: 'Đáp án',
        sortable: true,
        canAutoResize: true,
        maxWidth: 250,
      },
      {
        prop: 'createdDate',
        name: 'Ngày tạo',
        sortable: true,
        cellTemplate: this.colCreatedAt,
        maxWidth: 150,
      },
      {
        prop: 'status',
        name: 'Trạng thái',
        sortable: true,
        maxWidth: 150,
      },
      {
        prop: 'action',
        minWidth: 180,
        name: 'Hành động',
        sortable: false,
        maxWidth: 200,
        canAutoResize: true,
        cellTemplate: this.actionTemplate,
        cellClass: 'align-items-center d-flex',
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

  deleteQuest(id: number) {
    const bsModalRef = this.modalService.show(DeleteModalComponent, {
      initialState: {
        id: id.toString(),
        title: 'Quest',
      },
    });
    bsModalRef.onHide
      ?.pipe(
        take(1),
        filter((s) => (s as any).data)
      )
      .subscribe({
        next: (result) => {
          window.location.reload();
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
  columns: TableColumn[] = [];

  @ViewChild(DatatableComponent) table!: DatatableComponent;

  onPage(paging: PageInfo) {
    this.searchQuestItem$.next({
      ...this.searchQuestItem$.getValue(),
      currentPage: paging.offset,
    });
  }
  onSort(event: SortInfo) {
    this.table.offset - 1;
    this.searchQuestItem$.next({
      ...this.searchQuestItem$.getValue(),
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
}
