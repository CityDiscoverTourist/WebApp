import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import {
  DatatableComponent,
  SelectionType,
  TableColumn,
} from '@swimlane/ngx-datatable';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  take,
  Observable,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import {
  PagingMetadata,
  Quest,
  QuestItemListItem,
  QuestItemListSearch,
  QuestListItem,
  SearchInfo,
} from 'src/app/models';
import { QuestItemService, QuestService } from 'src/app/services';
import { PageInfo, SortInfo } from 'src/app/types';
import { DeleteModalComponent } from '../../share';
import { QuestDeleteModalComponent } from '../../share/quest-delete-modal/quest-delete-modal.component';
import { QuestItemListState } from '../states';
import { QuestDetailState } from '../states/questdetail.state';

@Component({
  selector: 'app-quest-detail',
  templateUrl: './quest-detail.component.html',
  styleUrls: ['./quest-detail.component.scss'],
})
export class QuestDetailComponent implements OnInit {
  private id: string;
  public questListItem: QuestListItem;
  constructor(
    private route: ActivatedRoute,
    private questService: QuestService,
    private modalService: BsModalService,
    private questDetailState: RxState<QuestDetailState>,
    //QuestItem
    private questItemService: QuestItemService,
    private questItemListState: RxState<QuestItemListState>
  ) {}

  ngOnInit(): void {
    //Quest
    this.search$.next({ id: this.route.snapshot.params['id'] });
    this.questDetailState.connect(
      this.search$
        .pipe(
          tap((_) => this.questDetailState.set({ loading: true })),
          switchMap((s) => this.questService.getQuestById(s.id))
        )
        .pipe(tap((data) => (this.id = data.id.toString()))),
      (_, result) => ({
        quest: result,
        loading: false,
      })
    );
    //QuestItem
    this.searchQuestItem$.next({questId:this.route.snapshot.params['id']})
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
    // this.questItemListState.connect(
    //   this.searchQuestItem$.pipe(
    //     switchMap((s) => this.questItemService.getQuestItems(s))
    //   ),
    //   (_, result) => ({
    //     questitems: result.data.map(
    //       (x, index) =>
    //         ({
    //           index: ++index,
    //           id: x.id,
    //           content: x.content,
    //           description: x.description,
    //           duration: x.duration,
    //           createdDate: x.createdDate,
    //           updatedDate: x.updatedDate,
    //           qrCode: x.qrCode,
    //           triggerMode: x.triggerMode,
    //           rightAnswer: x.rightAnswer,
    //           answerImageUrl: x.answerImageUrl,
    //           status: x.status,
    //           questItemTypeId: x.questItemTypeId,
    //           locationId: x.locationId,
    //           questId: x.questId,
    //           itemId: x.itemId,
    //         } as QuestItemListItem)
    //     ),
    //     metadata: { ...result.pagination },
    //     loading: false,
    //   })
    // );
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
      this.submitSearch$.next({});
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

  search$ = new BehaviorSubject<{ id: string }>({ id: '' });
  get quest$(): Observable<Quest> {
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
        this.search$.next({
          ...this.search$.getValue(),
        });
      },
    });
  }

  onUpdate(id: string) {

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
    // console.log(paging);
    this.searchQuestItem$.next({
      ...this.searchQuestItem$.getValue(),
      currentPage: paging.offset,
    });
  }
  onSort(event: SortInfo) {
    // console.log(event);
    this.table.offset - 1;
    this.searchQuestItem$.next({
      ...this.searchQuestItem$.getValue(),
      sort: { sortBy: event.column.prop, dir: event.newValue },
    });
  }
  searchQuestItem$ = new BehaviorSubject<QuestItemListSearch>({});

  searchForm = new FormGroup({
    keyword: new FormControl(),
    // questItemTypeIds: new FormControl(),
  });

  submitSearch$ = new Subject<Partial<{ keyword: string }>>();
  resetSearch$ = new Subject<void>();
}
