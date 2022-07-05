import {
  Component,
  Inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  forkJoin,
  map,
  mergeAll,
  mergeMap,
  Observable,
  of,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';
import {
  IdValue,
  PagingMetadata,
  Quest,
  QuestItemListItem,
  QuestItemListSearch,
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
import { DeleteModalComponent } from '../../share';
import { QuestDeleteModalComponent } from '../../share/quest-delete-modal/quest-delete-modal.component';
import { QuestItemListState } from '../states';
import { QuestDetailState } from '../states/questdetail.state';
import { QuestItemState, QUEST_ITEM_STATE } from './quest-item/states';

@Component({
  selector: 'app-quest-detail',
  templateUrl: './quest-detail.component.html',
  styleUrls: ['./quest-detail.component.scss'],
  providers: [RxState],
})
export class QuestDetailComponent implements OnInit {
  private id: string;
  public questListItem: QuestListItem;
  constructor(
    @Inject(QUEST_ITEM_STATE) private questItemState: RxState<QuestItemState>,
    private readonly questItemTypeService: QuestItemTypeService,
    private questService: QuestService,
    private modalService: BsModalService,
    private questDetailState: RxState<QuestDetailState>,
    //QuestItem
    private questItemService: QuestItemService,
    private questItemListState: RxState<QuestItemListState>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private areaService: AreaService,
    private questTypeService: QuestTypeService
  ) {}

  ngOnInit(): void {
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
          return this.questItemService.getQuestItemsByQuestId({ questId: s });
        })
      ),
      (_, result) => ({
        questitems: result.data.map(
          (x, index) =>
            ({
              index: ++index,
              id: x.id,
              content: x.content,
              description: x.description,
              duration: x.duration,
              createdDate: x.createdDate,
              updatedDate: x.updatedDate,
              qrCode: x.qrCode,
              triggerMode: x.triggerMode,
              rightAnswer: x.rightAnswer,
              answerImageUrl: x.answerImageUrl,
              status: x.status,
              questItemTypeId: x.questItemTypeId,
              locationId: x.locationId,
              questId: x.questId,
              itemId: x.itemId,
            } as QuestItemListItem)
        ),
        metadata: { ...result.pagination },
        loading: false,
      })
    );

    this.questItemListState.connect(
      this.searchQuestItem$.pipe(
        switchMap((s) => this.questItemService.getQuestItemsByQuestId(s))
      ),
      (_, result) => ({
        questitems: result.data.map(
          (x, index) =>
            ({
              index: ++index,
              id: x.id,
              content: x.content,
              description: x.description,
              duration: x.duration,
              createdDate: x.createdDate,
              updatedDate: x.updatedDate,
              qrCode: x.qrCode,
              triggerMode: x.triggerMode,
              rightAnswer: x.rightAnswer,
              answerImageUrl: x.answerImageUrl,
              status: x.status,
              questItemTypeId: x.questItemTypeId,
              locationId: x.locationId,
              questId: x.questId,
              itemId: x.itemId,
            } as QuestItemListItem)
        ),
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
      }),
        (this.table.offset = 0);
    });
    this.questItemListState.hold(this.resetSearch$, () => {
      this.searchForm.reset();
      this.searchQuestItem$.next({ currentPage: 0 });
      this.table.offset = 0;
    });
  }

  showDeleteQuest() {
    const bsModalRef = this.modalService.show(QuestDeleteModalComponent, {
      initialState: {
        id: this.id,
      },
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
        // checkboxable: true,
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

  onDelete(id: string) {
    const bsModalRef = this.modalService.show(DeleteModalComponent, {
      initialState: {
        id: id,
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

  onUpdate(id: string) {
    this.router.navigate([`quest-item/${id}/edit`], {
      relativeTo: this.activatedRoute,
    });
  }

  get questItemTypeIds(): Observable<IdValue[]> {
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
    console.log(this.searchQuestItem$.getValue());
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
}
