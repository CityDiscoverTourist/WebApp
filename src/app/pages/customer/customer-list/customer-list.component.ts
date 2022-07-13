import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';
import { BehaviorSubject, Observable, Subject, switchMap, tap } from 'rxjs';
import { Customer, PagingMetadata, SearchInfo } from 'src/app/models';
import { CustomerService } from 'src/app/services';
import { PageInfo, SortInfo } from 'src/app/types';
import { CustomerListState } from '../states';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
  providers: [RxState],
})
export class CustomerListComponent implements OnInit {
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  columns: TableColumn[] = [];
  isLock: { id: string; value: boolean }[] = [
    { id: 'Active', value: true },
    { id: 'InActive', value: false },
  ];
  constructor(
    private customerListState: RxState<CustomerListState>,
    private customerService: CustomerService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initTable();
    this.customerListState.connect(
      this.search$
        .pipe(
          tap(() => this.customerListState.set({ loading: true })),
          switchMap((s) => this.customerService.getCustomers(s))
        )
        .pipe(tap((data) => console.log(data))),
      (_, result) => ({
        customers: result.data,
        metadata: { ...result.pagination },
        loading: false,
      })
    );
    this.customerListState.hold(this.submitSearch$, (form) => {
      this.search$.next({
        ...this.search$.getValue(),
        ...form,
        currentPage: 0,
      }),
        (this.table.offset = 0);
    });

    this.customerListState.connect(this.resetSearch$, (prev, _) => ({
      metadata: { ...prev.metadata, currentPage: 0 },
    }));

    this.customerListState.hold(this.resetSearch$, () => {
      this.searchForm.reset();
      this.search$.next({ currentPage: 0 });
      this.table.offset = 0;
    });
  }

  @ViewChild('genderTemplate', { static: true })
  genderTemplate: TemplateRef<any>;
  @ViewChild('imageTemplate', { static: true })
  public imageTemplate: TemplateRef<any>;
  @ViewChild('confirmTemplate', { static: true })
  public confirmTemplate: TemplateRef<any>;
  @ViewChild('actionTemplate', { static: true })
  public actionTemplate: TemplateRef<any>;

  initTable() {
    this.columns = [
      {
        prop: 'imagePath',
        name: 'Hình ảnh',
        cellTemplate: this.imageTemplate,
        cellClass: 'align-items-center d-flex',
        width: 20,
      },
      {
        prop: 'userName',
        name: 'Tên đăng nhập',
        minWidth: 50,
      },
      {
        prop: 'email',
        name: 'Mail',
        minWidth: 50,
      },
      {
        prop: 'emailConfirmed',
        name: 'Xác thực mail',
        minWidth: 50,
        cellTemplate: this.confirmTemplate,
      },
      {
        prop: 'gender',
        name: 'Giới tính',
        cellTemplate: this.genderTemplate,
        width: 50,
      },
      {
        prop: 'address',
        name: 'Địa chỉ',
        minWidth: 100,
      },
      {
        prop: 'action',
        name: 'Thao tác',
        width: 50,
        canAutoResize: true,
        cellTemplate: this.actionTemplate,
      },
    ];
  }

  submitSearch$ = new Subject<Partial<{ keyword: string; isLock: boolean }>>();
  resetSearch$ = new Subject<void>();
  search$ = new BehaviorSubject<SearchInfo>({});
  searchForm = new FormGroup({
    keyword: new FormControl(),
    isLock: new FormControl(),
  });
  get customers$(): Observable<Customer[]> {
    return this.customerListState.select('customers');
  }
  get metadata$(): Observable<PagingMetadata> {
    return this.customerListState.select('metadata');
  }
  get loading$(): Observable<boolean> {
    return this.customerListState.select('loading');
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
  onDelete(id: string) {
    // const bsModalRef = this.modalService.show(DeleteModalComponent, {
    //   initialState: {
    //     id: id,
    //     title: 'thành phố',
    //   },
    // });
    // bsModalRef.onHide?.pipe(take(1),filter((s)=>(s as any).data)).subscribe({
    //   next: (result) => {
    //     this.search$.next({
    //       ...this.search$.getValue(),
    //     });
    //   },
    // });
  }
}
