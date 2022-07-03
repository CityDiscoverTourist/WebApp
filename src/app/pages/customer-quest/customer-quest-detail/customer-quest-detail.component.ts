import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';
import {
  BehaviorSubject,
  map,
  merge,
  Observable,
  pipe,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import {
  CustomerTask,
  CustomerTaskListItem,
  Paging,
  PagingMetadata,
} from 'src/app/models';
import { SignalrService } from 'src/app/services';
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

  @ViewChild(DatatableComponent) table!: DatatableComponent;
  columns: TableColumn[] = [];

  constructor(
    private signalRService: SignalrService,
    private httpClient: HttpClient,
    private customerTaskListState: RxState<CustomerTaskListState>,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    console.log(this.id);
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
      (prev, result) =>
        // {
        //   var data = prev.customertasks;
        //  var bc= data.find((x) => {
        //     if (x.questItemId === result.questItemId) {
        //       x.currentPoint = result.currentPoint;
        //       x.status = result.status;
        //       x.countWrongAnswer = result.countWrongAnswer;
        //       x.countSuggestion = result.countSuggestion;
        //       x.isFinished = result.isFinished;
        //     }
        //   });
        //   console.log("ddddddddddd");
        //   console.log(bc);
        //   prev.customertasks = data;
        //   console.log("hehe");
        //   console.log({...prev});
        //   return {...prev};
        // var data = prev.customertasks;
        // data.forEach((x) => {
        //   if (x.questItemId === result.questItemId) {
        //     x.currentPoint = result.currentPoint;
        //     x.status = result.status;
        //     x.countWrongAnswer = result.countWrongAnswer;
        //     x.countSuggestion = result.countSuggestion;
        //     x.isFinished = result.isFinished;
        //   }
        // });
        // prev.customertasks = data;
        // return {...prev};
        // }
        ({
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
