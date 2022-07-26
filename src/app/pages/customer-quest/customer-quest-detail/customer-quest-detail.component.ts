import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';
import { BehaviorSubject, Observable, Subject, switchMap, tap } from 'rxjs';
import {
  CustomerQuest,
  CustomerTask,
  CustomerTaskListItem,
  Paging,
  PagingMetadata,
} from 'src/app/models';
import { CustomerquestService, SignalrService } from 'src/app/services';
import { CustomerTaskListState } from '../states';

@Component({
  selector: 'app-customer-quest-detail',
  templateUrl: './customer-quest-detail.component.html',
  styleUrls: ['./customer-quest-detail.component.scss'],
  providers: [RxState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerQuestDetailComponent implements OnInit {
  private id: string;
  isFinishes: { id: string; value: boolean }[] = [];
  customerQuest: CustomerQuest = {
    id: 0,
    beginPoint: '',
    endPoint: '',
    createdDate: new Date(),
    rating: 0,
    feedBack: '',
    customerId: '',
    customerName: '',
    isFinished: false,
    questId: 0,
    paymentId: '',
    status: '',
  };

  @ViewChild(DatatableComponent) table!: DatatableComponent;
  columns: TableColumn[] = [];

  constructor(
    private signalRService: SignalrService,
    private httpClient: HttpClient,
    private customerTaskListState: RxState<CustomerTaskListState>,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private customerQuestService: CustomerquestService
  ) {}

  ngOnInit(): void {
    this.isFinishes = this.customerQuestService.isFinishes;
    this.id = this.route.snapshot.params['id'];
    if (Number(this.id) > 0) {
      this.customerQuestService
        .getCustomerQuestById(this.id)
        .subscribe((data) => {
          console.log(data);

          this.customerQuest = data;
        });
    }
    this.initTable();
    this.signalRService.startConnection();
    this.signalRService.addTranferDataListener();
    this.signalRService.addTranferDataCustomerTaskListener();
    this.signalRService.addTranferDataUpdateCustomerTaskListener();

    this.customerTaskListState.connect(
      this.search$.pipe(switchMap(() => this.startHttpRequest(this.id))),
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
    // this.signalRService.subject.subscribe(data=>{
    //   console.log("data ne ban");
    //   console.log(data);

    // })
    this.customerTaskListState.connect(
      this.signalRService.subject.pipe(
        tap((data) => {
          // console.log("data1")
          // console.log(data);
          return data;
        })
      ),

      (prev, result) => ({
        customertasks: [result as CustomerTask, ...prev.customertasks],
      })
    );
    this.customerTaskListState.connect(
      this.signalRService.subjectCustomerTask$.pipe(
        tap((data) => data as CustomerTask)
      ),
      (prev, result) => ({
        customertasks: [...prev.customertasks, result],
      })
    );

    this.customerTaskListState.connect(
      this.signalRService.subjectUpdateCustomerTask$.pipe(
        tap((data) => data as CustomerTask)
      ),
      (prev, result) => ({
        customertasks: [
          ...prev.customertasks.slice(0, prev.customertasks.length - 1),
          result,
        ],
      })
    );
  }

  private startHttpRequest(
    id: string
  ): Observable<Paging<CustomerTaskListItem>> {
    return this.httpClient.get<Paging<CustomerTaskListItem>>(
      // `https://citytourist.azurewebsites.net/api/v1/customer-tasks`
      `https://citytourist.azurewebsites.net/api/v1/customer-tasks/get-by-customer-quest-id/${id}?PageSize=100`
    );
  }
  // private startHttpRequest = () => {
  //   this.httpClient
  //     .get(`https://citytourist.azurewebsites.net/api/v1/customer-tasks`)
  //     .subscribe((data) => console.log(data));
  // };
  @ViewChild('colCreatedAt', { static: true }) colCreatedAt!: TemplateRef<any>;
  @ViewChild('isFinishedTemplate', { static: true })
  isFinishedTemplate!: TemplateRef<any>;
  initTable() {
    this.columns = [
      // {
      //   prop: 'id',
      //   maxWidth: 250,
      //   // name: 'Tên khu vực',
      //   sortable: true,
      // },
      {
        prop: 'currentPoint',
        canAutoResize: true,
        name: 'Điểm hiện tại',
        sortable: true,
        minWidth: 50,
        headerClass: 'd-flex justify-content-center',
        cellClass: 'd-flex justify-content-center',
      },
      // {
      //   prop: 'status',
      //   maxWidth: 100,
      //   minWidth: 150,
      //   // name: 'Trạng thái',
      //   sortable: true,
      // },
      {
        prop: 'createdDate',
        minWidth: 150,
        name: 'Ngày tạo',
        sortable: true,
        cellTemplate: this.colCreatedAt,
        headerClass: 'd-flex justify-content-center',
        cellClass: 'd-flex justify-content-center',
      },
      {
        prop: 'questItemId',
        minWidth: 150,
        name: 'Câu hỏi',
        // name: 'Trạng thái',
        sortable: true,
        headerClass: 'd-flex justify-content-center',
        cellClass: 'd-flex justify-content-center',
      },
      {
        prop: 'countWrongAnswer',
        name: 'Số lần sai',

        minWidth: 150,
        sortable: true,
        headerClass: 'd-flex justify-content-center',
        cellClass: 'd-flex justify-content-center',
      },
      {
        prop: 'countSuggestion',
        name: 'Số lần gợi ý',
        minWidth: 150,
        sortable: true,
        headerClass: 'd-flex justify-content-center',
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
    ];
  }
  submitSearch$ = new Subject<
    Partial<{ keyword: string; isFinished: string }>
  >();
  search$ = new BehaviorSubject<{}>({});
  resetSearch$ = new Subject<void>();
  searchForm = new FormGroup({
    keyword: new FormControl(),
    isFinished: new FormControl(),
  });

  onUpdate(id: string) {}
  onDelete(id: string) {}

  get customerTasks$(): Observable<CustomerTaskListItem[]> {
    return this.customerTaskListState.select('customertasks');
    // .pipe(tap((data) => console.log(data)));
  }

  get loading$(): Observable<boolean> {
    return this.customerTaskListState.select('loading');
  }

  get metadata$(): Observable<PagingMetadata> {
    return this.customerTaskListState.select('metadata');
  }
}
