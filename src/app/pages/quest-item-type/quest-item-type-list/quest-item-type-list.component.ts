import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { RxState } from '@rx-angular/state';
import { DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, Subject, switchMap, take, tap } from 'rxjs';
import { PagingMetadata, QuestItemTypeListItem, SearchInfo } from 'src/app/models';
import { QuestItemTypeService } from 'src/app/services';
import { PageInfo, SortInfo } from 'src/app/types';
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
        sortable:false,
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
        sortable:false,
        maxWidth: 200,
        canAutoResize: true,
        cellTemplate: this.actionTemplate,
        cellClass:"align-items-center d-flex"
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
  });

  submitSearch$ = new Subject<Partial<{ keyword: string }>>();
  resetSearch$ = new Subject<void>();

  showAddQuestItemType() {
    //   const bsModalRef = this.modalService.show(CityModalComponent, {
    //   initialState: {
    //     simpleForm: false,
    //   },
    // }
    // );
    // bsModalRef.onHide?.pipe(take(1)).subscribe({
    //   next: (result) => {
    //     const data = result as { id: number; name: string };
    //     if (data.id > 0 && data.name.length > 0) {
    //       this.toast.success('Tạo thành phố thành công!', {
    //         duration: 5000,
    //         dismissible: true,
    //         style: {
    //           // border: '1px solid #0DB473',
    //           // padding: '16px',
    //           padding: '16px',
    //           // color: '#0DB473',
    //           // background:'#0DB473',
    //           width: '600px',
    //           height: '62px',
    //         },
    //         // iconTheme: {
    //         //   primary: '#fff',
    //         //   secondary: '#fff',
    //         // },
    //       });
    //     }
    //     this.search$.next({
    //       ...this.search$.getValue(),
    //     });
    //   },
    // });
  }
  onDelete(id: string) {
    // const bsModalRef = this.modalService.show(DeleteModalComponent, {
    //   initialState: {
    //     id: id,
    //   },
    // });
    // bsModalRef.onHide?.pipe(take(1)).subscribe({
    //   next: (result) => {
    //     this.search$.next({
    //       ...this.search$.getValue(),
    //     });
    //   },
    // });
  }

  onUpdate(id: string) {
    // const bsModalRef = this.modalService.show(CityModalUpdateComponent, {
    //   initialState: {
    //     id: id,
    //   },
    // });
    // bsModalRef.onHide?.pipe(take(1)).subscribe({
    //   next: (result) => {
    //     this.search$.next({
    //       ...this.search$.getValue(),
    //     });
    //   },
    // });
  }

}
