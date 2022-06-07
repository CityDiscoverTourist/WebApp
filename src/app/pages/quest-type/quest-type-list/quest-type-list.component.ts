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
import { PagingMetadata, QuestTypeListItem, SearchInfo } from 'src/app/models';
import { QuestTypeService } from 'src/app/services';
import { PageInfo, SortInfo } from 'src/app/types';
import { DeleteModalComponent, QuestTypeModalComponent } from '../../share';
import { QuestTypeListState } from '../states';

@Component({
  selector: 'app-quest-type-list',
  templateUrl: './quest-type-list.component.html',
  styleUrls: ['./quest-type-list.component.scss'],
  providers: [RxState],
})
export class QuestTypeListComponent implements OnInit {
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  columns: TableColumn[] = [];
  constructor(
    private questTypeListState: RxState<QuestTypeListState>,
    private questTypeService: QuestTypeService,
    private modalService: BsModalService,
    private toast: HotToastService
  ) {}
  ngOnInit(): void {
    this.initTable();
    this.questTypeListState.connect(
      this.search$
        .pipe(
          tap(() => this.questTypeListState.set({ loading: true })),
          switchMap((s) => this.questTypeService.getQuestTypes(s))
        )
        .pipe(tap((data) => console.log(data))),
      (_, result) => ({
        questtypes: result.data.map(
          (x, i) =>
            ({
              index: ++i,
              id: x.id,
              name: x.name,
              status: x.status,
              imagePath: x.imagePath,
            } as QuestTypeListItem)
        ),
        metadata: { ...result.pagination },
        loading: false,
      })
    );

    this.questTypeListState.hold(this.submitSearch$, (form) => {
      this.search$.next({
        ...this.search$.getValue(),
        ...form,
        currentPage: 0,
      }),
        (this.table.offset = 0);
    });

    this.questTypeListState.connect(this.resetSearch$, (prev, _) => ({
      metadata: { ...prev.metadata, currentPage: 0 },
    }));

    this.questTypeListState.hold(this.resetSearch$, () => {
      this.searchForm.reset();
      this.search$.next({ currentPage: 0 });
      this.table.offset = 0;
    });
  }
  @ViewChild('actionTemplate', { static: true }) public actionTemplate: TemplateRef<any>;
  @ViewChild('imageTemplate', { static: true }) public imageTemplate: TemplateRef<any>;

  initTable() {
    this.columns = [
      {
        prop: 'imagePath',
        name:'Hình ảnh',
        sortable: false,
        cellTemplate: this.imageTemplate,
        cellClass: 'align-items-center d-flex',
        width:50
      },
      {
        prop: 'name',
        name: 'Tên loại Quest',
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

  get questtypes$(): Observable<QuestTypeListItem[]> {
    return this.questTypeListState.select('questtypes');
  }
  get metadata$(): Observable<PagingMetadata> {
    return this.questTypeListState.select('metadata');
  }
  get loading$(): Observable<boolean> {
    return this.questTypeListState.select('loading');
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
  });

  submitSearch$ = new Subject<Partial<{ keyword: string }>>();
  resetSearch$ = new Subject<void>();

  showAddQuestType() {
    const bsModalRef = this.modalService.show(QuestTypeModalComponent, {
      initialState: {
        simpleForm: false,
        title: 'loại Quest',
        type: 'Thêm',
      },
    });
    bsModalRef.onHide?.pipe(take(1)).subscribe({
      next: (result) => {
        const data = result as { id: number; name: string };
        if (data.id > 0 && data.name.length > 0) {
          this.toast.success('Tạo loại Quest thành công!', {
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
        title: 'loại Quest',
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
    const bsModalRef = this.modalService.show(QuestTypeModalComponent, {
      initialState: {
        id: id,
        title: 'loại Quest',
        type: 'Cập nhật',
      },
    });
    bsModalRef.onHide?.pipe(take(1)).subscribe({
      next: (result) => {
        const data = result as { id: number; name: string };
        if (data.id > 0 && data.name !== undefined) {
          this.toast.success('Cập nhật loại Quest thành công!', {
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
