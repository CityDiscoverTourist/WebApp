import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { RxState } from '@rx-angular/state';
import { DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
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
})
export class QuestItemTypeListComponent implements OnInit {
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  columns: TableColumn[] = [];
  status: { id: number; value: string }[] = [];
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
  initTable() {
    this.columns = [
      {
        prop: 'index',
        name: 'STT',
        sortable: false,
        width: 50,
      },
      {
        prop: 'name',
        name: 'Tên loại Quest Item',
        sortable: true,
        minWidth: 300,
      },
      {
        prop: 'status',
        maxWidth: 350,
        minWidth: 200,
        name: 'Trạng thái',
        sortable: true,
        canAutoResize: true,
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
        title: 'loại Quest Item',
        type: 'Thêm',
        id:'0'
      },
    });
    bsModalRef.onHide?.pipe(take(1)).subscribe({
      next: (result) => {
        const data = result as { id: number; name: string };
        if (data.id > 0 && data.name.length > 0) {
          this.toast.success('Tạo loại Quest Item thành công!', {
            position: 'top-center',
            duration: 5000,
            style: {
              border: '1px solid #0a0',
              padding: '16px',
            },
            iconTheme: {
              primary: '#0a0',
              secondary: '#fff',
            },
            role: 'status',
            ariaLive: 'polite',
          });
        }
        this.search$.next({
          ...this.search$.getValue(),
        });
      },
    });
  }
  onDelete(id: string) {
    const bsModalRef = this.modalService.show(DeleteModalComponent, {
      initialState: {
        id: id,
        title: 'loại Quest Item',
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
    const bsModalRef = this.modalService.show(QuestItemTypeModalComponent, {
      initialState: {
        id: id,
        title: 'loại Quest Item',
        type: 'Cập nhật',
      },
    });
    bsModalRef.onHide?.pipe(take(1)).subscribe({
      next: (result) => {
        const data = result as { id: number; name: string };
        if (data.id > 0 && data.name !== undefined) {
          this.toast.success('Cập nhật Quest Item thành công!', {
            position: 'top-center',
            duration: 2000,
            style: {
              border: '1px solid #0a0',
              padding: '16px',
            },
            iconTheme: {
              primary: '#0a0',
              secondary: '#fff',
            },
            role: 'status',
            ariaLive: 'polite',
          });
          this.search$.next({
            ...this.search$.getValue(),
          });
        }
      },
    });
  }
}
