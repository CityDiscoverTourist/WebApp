import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RxState } from '@rx-angular/state';
import { DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';
import { BehaviorSubject, Observable, Subject, switchMap, tap } from 'rxjs';
import { PagingMetadata, Reward, SearchInfo } from 'src/app/models';
import { PageInfo, SortInfo } from 'src/app/types';
import { RewardService } from 'src/app/services';
import { RewardListState } from '../states';

@Component({
  selector: 'app-reward-list',
  templateUrl: './reward-list.component.html',
  styleUrls: ['./reward-list.component.scss'],
  providers: [RxState],
  encapsulation: ViewEncapsulation.None,
})
export class RewardListComponent implements OnInit {
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  columns: TableColumn[] = [];
  status: { id: string; value: string }[] = [];

  constructor(
    private rewardListState: RxState<RewardListState>,
    private rewardService: RewardService
  ) {}
  ngOnInit(): void {
    this.initTable();
    this.rewardListState.connect(
      this.search$.pipe(
        tap(() => this.rewardListState.set({ loading: true })),
        switchMap((s) => this.rewardService.getRewards(s))
      ),
      (_, result) => ({
        cities: result.data,
        metadata: { ...result.pagination },
        loading: false,
      })
    );

    this.status =[
      {
        id: 'Khả dụng',
        value: 'Active',
      },
      {
        id: 'Không khả dụng',
        value: 'Inactive',
      },
    ];;

    this.rewardListState.hold(this.submitSearch$, (form) => {
      this.search$.next({
        ...this.search$.getValue(),
        ...form,
        currentPage: 0,
      }),
        (this.table.offset = 0);
    });

    this.rewardListState.connect(this.resetSearch$, (prev, _) => ({
      metadata: { ...prev.metadata, currentPage: 0 },
    }));

    this.rewardListState.hold(this.resetSearch$, () => {
      this.searchForm.reset();
      this.search$.next({ currentPage: 0 });
      this.table.offset = 0;
    });
  }

  @ViewChild('colCreatedAt', { static: true }) colCreatedAt!: TemplateRef<any>;
  @ViewChild('colPercent', { static: true }) colPercent!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true })
  public statusTemplate: TemplateRef<any>;
  initTable() {
    this.columns = [
      {
        prop: 'name',
        name: 'Quà tặng',
        width:115,
        sortable:false,
        headerClass: 'd-flex justify-content-center',
      },
      {
        prop: 'customerEmail',
        name: 'Khách hàng',
        sortable:false,
        minWidth: 215,
        headerClass: 'd-flex justify-content-center',
      },
      {
        prop: 'code',
        name: 'Mã quà tặng',
        sortable:false,
        minWidth: 280,
        headerClass: 'd-flex justify-content-center',
      },
      {
        prop: 'receivedDate',
        name: 'Ngày nhận',
        cellTemplate: this.colCreatedAt,
        width: 95,
        headerClass: 'd-flex justify-content-center',
        cellClass: 'd-flex justify-content-center',
      },
      {
        prop: 'expiredDate',
        name: 'Ngày hết hạn',
        cellTemplate: this.colCreatedAt,
        width: 95,
        headerClass: 'd-flex justify-content-center',
        cellClass: 'd-flex justify-content-center',
      },
      {
        prop: 'percentDiscount',
        name: 'Phần trăm',
        width: 70,
        headerClass: 'd-flex justify-content-center',
        cellClass: 'd-flex justify-content-center',
        cellTemplate: this.colPercent,
        sortable:false,
      },
      {
        prop: 'status',
        name: 'Trạng thái',
        cellTemplate: this.statusTemplate,
        width: 120,
        headerClass: 'd-flex justify-content-center',
        cellClass: 'd-flex justify-content-center',
      },
    ];
  }

  get rewards$(): Observable<Reward[]> {
    return this.rewardListState.select('cities');
  }
  get metadata$(): Observable<PagingMetadata> {
    return this.rewardListState.select('metadata');
  }
  get loading$(): Observable<boolean> {
    return this.rewardListState.select('loading');
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
}
