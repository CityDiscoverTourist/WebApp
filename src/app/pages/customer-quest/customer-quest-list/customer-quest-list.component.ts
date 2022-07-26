import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';
import {
  BehaviorSubject,
  Observable,
  Subject,
  switchMap, tap
} from 'rxjs';
import {
  CustomerQuestListItem,
  PagingMetadata,
  SearchInfo
} from 'src/app/models';
import { CustomerquestService } from 'src/app/services';
import { PageInfo, SortInfo } from 'src/app/types';
import { CustomerQuestListState } from '../states';

@Component({
  selector: 'app-customer-quest-list',
  templateUrl: './customer-quest-list.component.html',
  styleUrls: ['./customer-quest-list.component.scss'],
  providers: [RxState],
  encapsulation: ViewEncapsulation.None,
})
export class CustomerQuestListComponent implements OnInit {
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  columns: TableColumn[] = [];
  isFinishes: { id: string; value: boolean }[] = [];
  constructor(
    private customerQuestListState: RxState<CustomerQuestListState>,
    private customerQuestService: CustomerquestService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initTable();
    this.isFinishes = this.customerQuestService.isFinishes;
    this.customerQuestListState.connect(
      this.search$
        .pipe(
          tap(() => this.customerQuestListState.set({ loading: true })),
          switchMap((s) => this.customerQuestService.getCustomerQuest(s))
        )
        .pipe(tap((data) => console.log(data))),
      (_, result) => ({
        customerquests: result.data,
        metadata: { ...result.pagination },
        loading: false,
      })
    );
    this.customerQuestListState.hold(this.submitSearch$, (form) => {
      this.search$.next({
        ...this.search$.getValue(),
        ...form,
        currentPage: 0,
      }),
        (this.table.offset = 0);
    });

    this.customerQuestListState.connect(this.resetSearch$, (prev, _) => ({
      metadata: { ...prev.metadata, currentPage: 0 },
    }));

    this.customerQuestListState.hold(this.resetSearch$, () => {
      this.searchForm.reset();
      this.search$.next({ currentPage: 0 });
      this.table.offset = 0;
    });
  }

  @ViewChild('colCreatedAt', { static: true }) colCreatedAt!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true })
  statusTemplate!: TemplateRef<any>;
  @ViewChild('isFinishedTemplate', { static: true })
  isFinishedTemplate!: TemplateRef<any>;

  initTable() {
    this.columns = [
      {
        prop: 'customerName',
        name: 'Khách hàng',
        sortable: false,
        minWidth: 230,
      },
      {
        prop: 'beginPoint',
        headerClass: 'd-flex justify-content-center',
        name: 'Điểm bắt đầu',
        sortable: false,
        minWidth: 40,
        cellClass: 'd-flex justify-content-center',
      },
      {
        prop: 'endPoint',
        name: 'Điểm kết thúc',
        sortable: false,
        minWidth: 40,
        headerClass: 'd-flex justify-content-center',
        cellClass: 'd-flex justify-content-center',
      },
      {
        prop: 'createdDate',
        name: 'Ngày tạo',
        cellTemplate: this.colCreatedAt,
        sortable: false,
        minWidth: 150,
        cellClass: 'd-flex justify-content-center',
      },
      {
        prop: 'rating',
        name: 'Số điểm đánh giá',
        sortable: false,
        canAutoResize: true,
        cellClass: 'd-flex justify-content-center',
      },
      {
        prop: 'isFinished',
        name: 'Kết thúc',
        sortable: false,
        minWidth: 90,
        headerClass: 'd-flex justify-content-center',
        canAutoResize: true,
        cellTemplate: this.isFinishedTemplate,
        cellClass: 'd-flex justify-content-center',
      },
      // {
      //   prop: 'status',
      //   name: 'Trạng thái',
      //   sortable: false,
      //   canAutoResize: true,
      //   minWidth:90,
      //   cellTemplate:this.statusTemplate
      // },
    ];
  }

  submitSearch$ = new Subject<Partial<{ keyword: string; status: string }>>();
  resetSearch$ = new Subject<void>();
  search$ = new BehaviorSubject<SearchInfo>({});
  searchForm = new FormGroup({
    keyword: new FormControl(),
    isFinished: new FormControl(),
  });
  get questtypes$(): Observable<CustomerQuestListItem[]> {
    return this.customerQuestListState
      .select('customerquests')
      .pipe(tap((data) => console.log(data)));
  }
  get metadata$(): Observable<PagingMetadata> {
    return this.customerQuestListState.select('metadata');
  }
  get loading$(): Observable<boolean> {
    return this.customerQuestListState.select('loading');
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
  onActivate(event: any) {
    if (event.type == 'click') {
      console.log(event.row);
      this.router.navigate(['./', event.row.id, 'customer-tasks'], {
        relativeTo: this.activatedRoute,
      });
    }
  }
}
