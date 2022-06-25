import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';
import {
  BehaviorSubject,
  Observable,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';
import {
  CustomerQuestListItem,
  PagingMetadata,
  SearchInfo,
} from 'src/app/models';
import { CustomerquestService } from 'src/app/services';
import { PageInfo, SortInfo } from 'src/app/types';
import { CustomerQuestListState } from '../states';

@Component({
  selector: 'app-customer-quest-list',
  templateUrl: './customer-quest-list.component.html',
  styleUrls: ['./customer-quest-list.component.scss'],
  providers: [RxState],
})
export class CustomerQuestListComponent implements OnInit {
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  columns: TableColumn[] = [];
  isFinishes = [true, false];
  constructor(
    private customerQuestListState: RxState<CustomerQuestListState>,
    private questQuestService: CustomerquestService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initTable();
    this.customerQuestListState.connect(
      this.search$
        .pipe(
          tap(() => this.customerQuestListState.set({ loading: true })),
          switchMap((s) => this.questQuestService.getQuestTypes(s))
        )
        .pipe(tap((data) => console.log(data))),
      (_, result) => ({
        customerquests: result.data,
        // .map(
        //   (x, i) =>
        //     ({
        //       beginPoint: x.beginPoint,
        //       endPoint: x.endPoint,
        //       createdDate: x.createdDate,
        //       rating: x.rating,
        //       feedBack: x.feedBack,
        //       customerId: x.customerId,
        //       isFinished: x.isFinished,
        //       questId: x.questId,
        //       status: x.status,
        //     } as CustomerQuestListItem)
        // )
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

  initTable() {
    this.columns = [
      {
        prop: 'customerId',
        name: 'Khách hàng',
        sortable: false,
      },
      // {
      //   prop: 'beginPoint',
      //   name: 'Số điểm bắt đầu',
      //   sortable: false,
      // },
      // {
      //   prop: 'endPoint',
      //   name: 'Số điểm kết thúc',
      //   sortable: false,
      // },
      {
        prop: 'createdDate',
        name: 'Ngày tạo',
        cellTemplate: this.colCreatedAt,
        sortable: false,
        maxWidth: 150,
      },
      {
        prop: 'rating',
        name: 'Số điểm đánh giá',
        sortable: false,
        canAutoResize: true,
      },
      {
        prop: 'feedBack',
        name: 'Đánh giá',
        sortable: false,
        canAutoResize: true,
      },
      {
        prop: 'isFinished',
        name: 'Kết thúc',
        sortable: false,
        canAutoResize: true,
      },
      {
        prop: 'status',
        name: 'Trạng thái',
        sortable: false,
        canAutoResize: true,
      },
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
    return this.customerQuestListState.select('customerquests');
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
    // console.log('Activate Event', event);
    if (event.type == 'click') {
      console.log(event.row);
      this.router.navigate(['./', event.row.id, 'customer-tasks'], {
        relativeTo: this.activatedRoute,
      });
    }
  }
}
