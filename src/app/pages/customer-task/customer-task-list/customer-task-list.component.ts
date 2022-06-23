import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RxState } from '@rx-angular/state';
import { DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';
import {
  BehaviorSubject,
  Observable,
  of,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { CustomerTaskListItem, Paging, PagingMetadata } from 'src/app/models';
import { SignalrService } from 'src/app/services';
import { CustomerTaskListState } from '../states';

@Component({
  selector: 'app-customer-task-list',
  templateUrl: './customer-task-list.component.html',
  styleUrls: ['./customer-task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class CustomerTaskListComponent implements OnInit {
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  columns: TableColumn[] = [];

  constructor(
    private signalRService: SignalrService,
    private httpClient: HttpClient,
    private customerTaskListState: RxState<CustomerTaskListState>
  ) {}

  ngOnInit(): void {
    this.initTable();
    this.signalRService.startConnection();
    this.signalRService.addTranferDataListener();
    this.customerTaskListState.connect(
      this.search$.pipe(switchMap(() => this.startHttpRequest())),
      (_, result) => ({
        customertasks: result.data.map((x) => ({
          id: x.id,
          currentPoint: x.currentPoint,
          status: x.status,
          createdDate: x.createdDate,
          questItemId: x.questItemId,
          customerQuestId: x.customerQuestId,
          countWrongAnswer: x.countWrongAnswer,
          countSuggestion: x.countSuggestion,
          isFinished: x.isFinished,
        })),
        metadata: { ...result.pagination },
        loading: false,
      })
    );
  }

  private startHttpRequest(): Observable<Paging<CustomerTaskListItem>> {
    return this.httpClient.get<Paging<CustomerTaskListItem>>(
      `https://citytourist.azurewebsites.net/api/v1/customer-tasks`
    );
  }
  // private startHttpRequest = () => {
  //   this.httpClient
  //     .get(`https://citytourist.azurewebsites.net/api/v1/customer-tasks`)
  //     .subscribe((data) => console.log(data));
  // };

  initTable() {
    this.columns = [
      {
        prop: 'id',
        maxWidth: 250,
        // name: 'Tên khu vực',
        sortable: true,
      },
      {
        prop: 'currentPoint',
        canAutoResize: true,
        // name: 'Địa chỉ',
        sortable: true,
        cellClass: 'text-overflow: ellipsis;',
      },
      {
        prop: 'status',
        maxWidth: 100,
        minWidth: 150,
        // name: 'Trạng thái',
        sortable: true,
      },
      {
        prop: 'createdDate',
        maxWidth: 100,
        minWidth: 150,
        // name: 'Trạng thái',
        sortable: true,
      },
      {
        prop: 'questItemId',
        maxWidth: 100,
        minWidth: 150,
        // name: 'Trạng thái',
        sortable: true,
      },
      {
        prop: 'customerQuestId',
        maxWidth: 100,
        minWidth: 150,
        // name: 'Trạng thái',
        sortable: true,
      },
      {
        prop: 'countWrongAnswer',
        maxWidth: 100,
        minWidth: 150,
        // name: 'Trạng thái',
        sortable: true,
      },
      {
        prop: 'countSuggestion',
        maxWidth: 100,
        minWidth: 150,
        // name: 'Trạng thái',
        sortable: true,
      },
      {
        prop: 'isFinished',
        maxWidth: 100,
        minWidth: 150,
        // name: 'Trạng thái',
        sortable: true,
      },
    ];
  }
  submitSearch$ = new Subject<
    Partial<{ keyword: string; cityIds: number[] }>
  >();
  search$ = new BehaviorSubject<{}>({});
  resetSearch$ = new Subject<void>();
  searchForm = new FormGroup({
    keyword: new FormControl(),
    status: new FormControl(),
  });

  onUpdate(id: string) {}
  onDelete(id: string) {}

  get customerTasks$(): Observable<CustomerTaskListItem[]> {
    return this.customerTaskListState
      .select('customertasks')
      .pipe(tap((data) => console.log(data)));
  }

  get loading$(): Observable<boolean> {
    return this.customerTaskListState.select('loading');
  }

  get metadata$(): Observable<PagingMetadata> {
    return this.customerTaskListState.select('metadata');
  }
}
