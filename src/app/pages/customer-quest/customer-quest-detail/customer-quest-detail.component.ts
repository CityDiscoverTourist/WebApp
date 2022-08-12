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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
import {
  CustomerquestService,
  CustomertaskService,
  QuestService,
  SignalrService,
} from 'src/app/services';
import { CustomerTaskListState } from '../states';
import { CustomeranswerModalComponent } from './customeranswer-modal/customeranswer-modal.component';
import { QuestionModalComponent } from './question-modal/question-modal.component';

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

  title: string;

  @ViewChild(DatatableComponent) table!: DatatableComponent;
  columns: TableColumn[] = [];

  constructor(
    private signalRService: SignalrService,
    private customertaskService: CustomertaskService,
    private httpClient: HttpClient,
    private customerTaskListState: RxState<CustomerTaskListState>,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private customerQuestService: CustomerquestService,
    private questService: QuestService,
    private modalService1: NgbModal
  ) {}

  ngOnInit(): void {
    this.isFinishes = this.customerQuestService.isFinishes;
    this.id = this.route.snapshot.params['id'];
    if (Number(this.id) > 0) {
      this.customerQuestService
        .getCustomerQuestById(this.id)
        .subscribe((data) => {
          this.customerQuest = data;
        });
      var questId = localStorage.getItem('questId')?.toString();
      this.questService
        .getQuestById(questId)
        .subscribe((data) => (this.title = data.title));
    }
    this.initTable();
    this.signalRService.startConnection();
    this.signalRService.addTranferDataListener();
    this.signalRService.addTranferDataCustomerTaskListener();
    this.signalRService.addTranferDataUpdateCustomerTaskListener();

    this.customerTaskListState.connect(
      this.search$.pipe(
        switchMap(() => this.customertaskService.startHttpRequest(this.id))
      ),
      (_, result) => ({
        customertasks: result.data,
        metadata: { ...result.pagination },
        loading: false,
      })
    );

    // this.customerTaskListState.connect(
    //   this.signalRService.subject$.pipe(
    //     tap((data) => {
    //       console.log("data");
    //       console.log(data);
          
    //       return data;
    //     })
    //   ),

    //   (prev, result) => ({
    //     customertasks: [result as CustomerTask, ...prev.customertasks],
    //   })
    // );
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
        tap((data) => console.log(data)
        )
      ),
      (prev, result) => ({
        customertasks: [
          ...prev.customertasks.slice(0, prev.customertasks.length - 1),
          result,
        ],
      })
    );
    // this.customerTaskListState.connect(
    //   this.signalRService.subjectUpdateCustomerTask$.pipe(
    //     tap((data) => data as CustomerTask)
    //   ),
    //   (prev, result) => ({
    //     customertasks: [
    //       ...prev.customertasks.slice(0, prev.customertasks.length - 1),
    //       result,
    //     ],
    //   })
    // );

  }

  @ViewChild('colCreatedAt', { static: true }) colCreatedAt!: TemplateRef<any>;
  @ViewChild('isFinishedTemplate', { static: true })
  isFinishedTemplate!: TemplateRef<any>;
  @ViewChild('questItemTemplate', { static: true })
  questItemTemplate!: TemplateRef<any>;
  @ViewChild('customerAnswerTemplate', { static: true })
  customerAnswerTemplate!: TemplateRef<any>;
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
        sortable: true,
        headerClass: 'd-flex justify-content-center',
        cellClass: 'd-flex justify-content-center',
        cellTemplate: this.questItemTemplate,
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
        prop: 'id',
        name: 'Khách trả lời',
        minWidth: 150,
        sortable: true,
        headerClass: 'd-flex justify-content-center',
        cellClass: 'd-flex justify-content-center',
        cellTemplate: this.customerAnswerTemplate,
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

  get customerTasks$(): Observable<CustomerTaskListItem[]> {
    return this.customerTaskListState.select('customertasks');
  }

  get loading$(): Observable<boolean> {
    return this.customerTaskListState.select('loading');
  }

  get metadata$(): Observable<PagingMetadata> {
    return this.customerTaskListState.select('metadata');
  }

  showQuestion(questItemId: string) {
    const modalRef = this.modalService1.open(QuestionModalComponent, {
      windowClass: 'dark-modal',
    });
    modalRef.componentInstance.questItemId = `${questItemId}`;
  }
  showCustomerAnswer(id: string) {
    const modalRef = this.modalService1.open(CustomeranswerModalComponent, {
      scrollable: true,
    });
    modalRef.componentInstance.id = `${id}`;
  }
}
