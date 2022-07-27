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
        name: 'Tên quà tặng',
        minWidth: 30,
        headerClass: 'd-flex justify-content-center',
      },
      {
        prop: 'customerName',
        name: 'Tên khách hàng',
      },
      {
        prop: 'code',
        name: 'Mã quà tặng',
        minWidth: 280,
        headerClass: 'd-flex justify-content-center',
      },
      {
        prop: 'receivedDate',
        name: 'Ngày nhận',
        cellTemplate: this.colCreatedAt,
        width: 115,
        headerClass: 'd-flex justify-content-center',
        cellClass: 'd-flex justify-content-center',
      },
      {
        prop: 'expiredDate',
        name: 'Ngày hết hạn',
        cellTemplate: this.colCreatedAt,
        width: 115,
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

  // showAddCity() {
  //   const bsModalRef = this.modalService.show(CityModalComponent, {
  //     initialState: {
  //       simpleForm: false,
  //       title: 'thành phố',
  //       type: 'Thêm',
  //       id:'0',
  //     },
  //   });
  //   bsModalRef.onHide
  //     ?.pipe(
  //       take(1),
  //       filter((s) => (s as any).success)
  //     )
  //     .subscribe({
  //       next: (result) => {
  //         const data = result as { id: string; name: string };
  //         console.log(data);

  //         if (Number(data.id) > 0 && data.name.length > 0) {
  //           this.toast.success('Tạo thành phố thành công!', {
  //             duration: 5000,
  //             dismissible: true,
  //           });
  //         }
  //         this.search$.next({
  //           ...this.search$.getValue(),
  //         });
  //       }
  //     });
  // }
  // onUpdateStatus(id: string, status:string) {
  //   const bsModalRef = this.modalService.show(DeleteModalComponent, {
  //     initialState: {
  //       id: id,
  //       title: 'thành phố',
  //       status: status
  //     },
  //   });
  //   bsModalRef.onHide?.pipe(take(1),filter((s)=>(s as any).data)).subscribe({
  //     next: (result) => {
  //       this.search$.next({
  //         ...this.search$.getValue(),
  //       });
  //     },
  //   });
  // }

  // onUpdate(id: string) {
  //   const bsModalRef = this.modalService.show(CityModalComponent, {
  //     initialState: {
  //       id: id,
  //       title: 'thành phố',
  //       type: 'Cập nhật',
  //     },
  //   });
  //   bsModalRef.onHide
  //     ?.pipe(
  //       take(1),
  //       filter((s) => (s as any).success)
  //     )
  //     .subscribe({
  //       next: (result) => {
  //         const data = result as { id: number; name: string };
  //         if (data.id > 0 && data.name !== undefined) {
  //           this.toast.success('Cập nhật thành phố thành công!');
  //           this.search$.next({
  //             ...this.search$.getValue(),
  //           });
  //         }
  //       },
  //     });
  // }
}
