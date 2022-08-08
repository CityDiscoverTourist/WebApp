import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { RxState } from '@rx-angular/state';
import { DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  filter,
  Observable,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';
import {
  PagingMetadata,
  QuestItemTypeListItem,
  SearchInfo,
} from 'src/app/models';
import { QuestItemTypeService } from 'src/app/services';
import { PageInfo, SortInfo } from 'src/app/types';
import { DeleteModalComponent } from '../../share/delete-modal/delete-modal.component';
import { QuestItemTypeModalComponent } from '../../share/quest-item-type-modal/quest-item-type-modal.component';
import { QuestItemTypeListState } from '../states';

@Component({
  selector: 'app-quest-item-type-list',
  templateUrl: './quest-item-type-list.component.html',
  styleUrls: ['./quest-item-type-list.component.scss'],
  providers: [RxState],
  encapsulation: ViewEncapsulation.None,
})
export class QuestItemTypeListComponent implements OnInit {
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  columns: TableColumn[] = [];
 status: { id: string; value: string }[] = [];
  constructor(
    private questItemTypeListState: RxState<QuestItemTypeListState>,
    private questItemTypeService: QuestItemTypeService,
    private modalService: BsModalService,
    private toast: HotToastService
  ) {}
  ngOnInit(): void {
    this.initTable();
    this.questItemTypeListState.connect(
      this.search$.pipe(
        tap(() => this.questItemTypeListState.set({ loading: true })),
        switchMap((s) => this.questItemTypeService.getQuestItemTypes(s))
      ),
      (_, result) => ({
        questitemtypes: result.data.map(
          (x, i) =>
            ({
              index: ++i,
              id: x.id,
              name: x.name,
              status: x.status,
              createdDate:x.createdDate
            } as QuestItemTypeListItem)
        ),
        metadata: { ...result.pagination },
        loading: false,
      })
    );

    this.status = this.questItemTypeService.status;

    this.questItemTypeListState.hold(this.submitSearch$, (form) => {
      this.search$.next({
        ...this.search$.getValue(),
        ...form,
        currentPage: 0,
      }),
        (this.table.offset = 0);
    });

    this.questItemTypeListState.connect(this.resetSearch$, (prev, _) => ({
      metadata: { ...prev.metadata, currentPage: 0 },
    }));

    this.questItemTypeListState.hold(this.resetSearch$, () => {
      this.searchForm.reset();
      this.search$.next({ currentPage: 0 });
      this.table.offset = 0;
    });
  }
  @ViewChild('actionTemplate', { static: true })
  public actionTemplate: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true })  public statusTemplate: TemplateRef<any>;
  @ViewChild('colCreatedAt', { static: true }) colCreatedAt!: TemplateRef<any>;
  initTable() {
    this.columns = [
      {
        prop: 'name',
        name: 'Tên loại câu hỏi',
        sortable: true,
        canAutoResize:true
      },
      {
        prop: 'createdDate',
        name: 'Ngày tạo',
        sortable: true,
       maxWidth:250,
        cellTemplate: this.colCreatedAt,
      },
      {
        prop: 'status',
        maxWidth:250,
        name: 'Trạng thái',
        sortable: true,
        canAutoResize: true,
        cellTemplate:this.statusTemplate
      },
      {
        prop: 'action',
        name: 'Hành động',
        sortable: false,
        maxWidth:250,
        canAutoResize: true,
        cellTemplate: this.actionTemplate,
        cellClass: 'align-items-center d-flex',
      },
    ];
  }

  get questitemtypes$(): Observable<QuestItemTypeListItem[]> {
    return this.questItemTypeListState.select('questitemtypes');
  }
  get metadata$(): Observable<PagingMetadata> {
    return this.questItemTypeListState.select('metadata');
  }
  get loading$(): Observable<boolean> {
    return this.questItemTypeListState.select('loading');
  }

  onPage(paging: PageInfo) {
    this.search$.next({
      ...this.search$.getValue(),
      currentPage: paging.offset,
    });
  }
  onSort(event: SortInfo) {
    this.table.offset - 1;
    this.search$.next({
      ...this.search$.getValue(),
      sort: { sortBy: event.column.prop, dir: event.newValue },
    });
  }

  search$ = new BehaviorSubject<SearchInfo>({});
  searchForm = new FormGroup({
    keyword: new FormControl(),
    status: new FormControl(),
  });

  submitSearch$ = new Subject<Partial<{ keyword: string; status: string }>>();

  resetSearch$ = new Subject<void>();

  showAddQuestItemType() {
    const bsModalRef = this.modalService.show(QuestItemTypeModalComponent, {
      initialState: {
        simpleForm: false,
        title: 'loại câu hỏi',
        type: 'Thêm',
        id:'0'
      },
    });
    bsModalRef.onHide?.pipe(take(1)).subscribe({
      next: (result) => {
        const data = result as { id: number; name: string };
        if (data.id > 0 && data.name.length > 0) {
          this.toast.success('Tạo loại câu hỏi thành công!');
        }
        this.search$.next({
          ...this.search$.getValue(),
        });
      },
    });
  }
  onUpdateStatus(id: string, status:string) {
    const bsModalRef = this.modalService.show(DeleteModalComponent, {
      initialState: {
        id: id,
        title: 'loại câu hỏi',
        status: status
      },
    });
    bsModalRef.onHide?.pipe(take(1),filter((s)=>(s as any).data)).subscribe({
      next: (result) => {
        this.search$.next({
          ...this.search$.getValue(),
        });
      },
    });
  }
  onUpdate(id: string) {
    const bsModalRef = this.modalService.show(QuestItemTypeModalComponent, {
      initialState: {
        id: id,
        title: 'loại câu hỏi',
        type: 'Cập nhật',
      },
    });
    bsModalRef.onHide?.pipe(take(1)).subscribe({
      next: (result) => {
        const data = result as { id: number; name: string };
        if (data.id > 0 && data.name !== undefined) {
          this.toast.success('Cập nhật loại câu hỏi thành công!');
          this.search$.next({
            ...this.search$.getValue(),
          });
        }
      },
    });
  }
}
