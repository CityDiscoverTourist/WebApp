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
import { BehaviorSubject, Observable, Subject, tap, switchMap } from 'rxjs';
import { PagingMetadata, SearchInfo, Notification } from 'src/app/models';
import { NotificationService } from 'src/app/services';
import { PageInfo, SortInfo } from 'src/app/types';
import { NotificationListState } from '../states';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
  providers: [RxState],
  encapsulation: ViewEncapsulation.None,
})
export class NotificationListComponent implements OnInit {
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  columns: TableColumn[] = [];
  status: { id: string; value: string }[] = [];

  constructor(
    private notificationListState: RxState<NotificationListState>,
    private notificationService: NotificationService
  ) {}
  ngOnInit(): void {
    this.initTable();
    this.notificationListState.connect(
      this.search$.pipe(
        tap(() => this.notificationListState.set({ loading: true })),
        switchMap((s) => this.notificationService.getNotificationList())
      ),
      (_, result) => ({
        notifications: result.data,
        metadata: { ...result.pagination },
        loading: false,
      })
    );

    this.status = this.notificationService.status;

    this.notificationListState.hold(this.submitSearch$, (form) => {
      this.search$.next({
        ...this.search$.getValue(),
        ...form,
        currentPage: 0,
      }),
        (this.table.offset = 0);
    });

    this.notificationListState.connect(this.resetSearch$, (prev, _) => ({
      metadata: { ...prev.metadata, currentPage: 0 },
    }));

    this.notificationListState.hold(this.resetSearch$, () => {
      this.searchForm.reset();
      this.search$.next({ currentPage: 0 });
      this.table.offset = 0;
    });
  }

  @ViewChild('colCreatedAt', { static: true })
  public colCreatedAt: TemplateRef<any>;
  initTable() {
    this.columns = [
      // {
      //   prop: 'paymentId',
      //   name: 'Mã thanh toán',
      //   sortable: false,
      //   minWidth: 300,
      // },
      {
        prop: 'content',
        name: 'Nội dung',
        sortable: false,
        minWidth: 900,
        canAutoResize: true,
      },
      {
        prop: 'createdDate',
        minWidth: 180,
        name: 'Ngày tạo',
        sortable: false,
        cellTemplate: this.colCreatedAt,
      },
    ];
  }

  get notifications$(): Observable<Notification[]> {
    return this.notificationListState.select('notifications');
  }
  get metadata$(): Observable<PagingMetadata> {
    return this.notificationListState.select('metadata');
  }
  get loading$(): Observable<boolean> {
    return this.notificationListState.select('loading');
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
