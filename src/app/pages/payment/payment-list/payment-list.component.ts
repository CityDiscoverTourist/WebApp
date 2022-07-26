import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import {
  ColumnMode,
  DatatableComponent,
  TableColumn,
} from '@swimlane/ngx-datatable';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, Subject, tap, switchMap } from 'rxjs';
import { PagingMetadata, Payment, SearchInfo } from 'src/app/models';
import { PaymentService } from 'src/app/services';
import { PageInfo, SortInfo } from 'src/app/types';
import { PaymentListState } from '../states';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss'],
  providers: [RxState],
})
export class PaymentListComponent implements OnInit {
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  columns: TableColumn[] = [];
  ColumnMode = ColumnMode;

  status: { id: string; value: string }[] = [
    { id: 'Đang xử lý', value: "Pending" },
    { id: 'Thành công', value: "Success" },
  ];

  constructor(
    private paymentListState: RxState<PaymentListState>,
    private paymentService: PaymentService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.initTable();
    this.paymentListState.connect(
      this.search$
        .pipe(
          tap(() => this.paymentListState.set({ loading: true })),
          switchMap((s) => this.paymentService.getPayments(s))
        )
        .pipe(tap((data) => console.log(data))),
      (_, result) => ({
        payments: result.data,
        metadata: { ...result.pagination },
        loading: false,
      })
    );
    this.paymentListState.hold(this.submitSearch$, (form) => {
      this.search$.next({
        ...this.search$.getValue(),
        ...form,
        currentPage: 0,
      }),
        (this.table.offset = 0);
    });

    this.paymentListState.connect(this.resetSearch$, (prev, _) => ({
      metadata: { ...prev.metadata, currentPage: 0 },
    }));

    this.paymentListState.hold(this.resetSearch$, () => {
      this.searchForm.reset();
      this.search$.next({ currentPage: 0 });
      this.table.offset = 0;
    });
  }

  initTable() {
    this.columns = [
      {
        prop: 'id',
        name: 'Mã thanh toán',
        sortable: false,
        minWidth: 180,
      },
      {
        prop: 'questName',
        name: 'Tên Quest',
        sortable: false,
        minWidth: 200,
      },
      {
        prop: 'customerEmail',
        name: 'Khách hàng',
        sortable: false,
        minWidth: 180,
      },
      {
        prop: 'quantity',
        name: 'Số lượng',
        minWidth: 18,
        sortable: false,
        headerClass: 'd-flex justify-content-center',
        cellClass: 'd-flex justify-content-center',
        
      },
      {
        prop: 'status',
        name: 'Trạng thái',
        minWidth: 90,
        sortable: false,
        cellTemplate:this.statusTemplate,
        headerClass: 'd-flex justify-content-center',
        cellClass: 'd-flex justify-content-center',
      },
      {
        prop: 'createdDate',
        name: 'Ngày tạo',
        sortable: false,
        cellTemplate: this.colCreatedAt,
        minWidth:100,
        headerClass: 'd-flex justify-content-center',
        cellClass: 'd-flex justify-content-center',
      },
      {
        prop: 'paymentMethod',
        name: 'Phương thức',
        minWidth: 90,
        sortable: false,
        canAutoResize: true,
        headerClass: 'd-flex justify-content-center',
        cellClass: 'd-flex justify-content-center',
      },

      {
        prop: 'totalAmount',
        name: 'Tổng',
        sortable: false,
        minWidth:140,
        cellTemplate:this.formatPrice,
        headerClass: 'd-flex justify-content-center',
        cellClass: 'd-flex justify-content-center',
      },
    ];
  }

  submitSearch$ = new Subject<Partial<{ keyword: string; isLock: boolean }>>();
  resetSearch$ = new Subject<void>();
  search$ = new BehaviorSubject<SearchInfo>({});
  searchForm = new FormGroup({
    keyword: new FormControl(),
    status: new FormControl(),
  });

  get payments$(): Observable<Payment[]> {
    return this.paymentListState.select('payments');
  }
  get metadata$(): Observable<PagingMetadata> {
    return this.paymentListState.select('metadata');
  }
  get loading$(): Observable<boolean> {
    return this.paymentListState.select('loading');
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
  @ViewChild('colCreatedAt', { static: true }) colCreatedAt!: TemplateRef<any>;
  @ViewChild('formatPrice', { static: true }) formatPrice!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
}
