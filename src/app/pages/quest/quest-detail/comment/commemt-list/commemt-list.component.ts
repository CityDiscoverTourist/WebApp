import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { RxState } from '@rx-angular/state';
import { DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';
import { BehaviorSubject, Observable, Subject, tap, switchMap } from 'rxjs';
import { PagingMetadata, SearchInfo, Comment } from 'src/app/models';
import { CommentService } from 'src/app/services';
import { PageInfo, SortInfo } from 'src/app/types';
import { CommentListState } from '../states';

@Component({
  selector: 'app-commemt-list',
  templateUrl: './commemt-list.component.html',
  styleUrls: ['./commemt-list.component.scss'],
  providers: [RxState],
  encapsulation: ViewEncapsulation.None,
})
export class CommemtListComponent implements OnInit {
  constructor(
    private commentListState: RxState<CommentListState>,
    private commentService: CommentService,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    //Comment
    this.initTable();
    this.commentListState.connect(
      this.searchComment$.pipe(
        tap(() => this.commentListState.set({ loading: true })),
        switchMap((s) => this.commentService.getComment(s))
      ),
      (_, result) => ({
        comments: result.data,
        metadata: { ...result.pagination },
        loading: false,
      })
    );

    this.status = [
      { id: 'Đã duyệt', value: 'true' },
      { id: 'Không được duyệt', value: 'false' },
    ];

    this.commentListState.hold(this.submitSearchComment$, (form) => {
      this.searchComment$.next({
        ...this.searchComment$.getValue(),
        ...form,
        currentPage: 0,
      }),
        (this.table.offset = 0);
    });

    this.commentListState.connect(this.resetSearchComment$, (prev, _) => ({
      metadata: { ...prev.metadata, currentPage: 0 },
    }));

    this.commentListState.hold(this.resetSearchComment$, () => {
      this.searchFormComment.reset();
      this.searchComment$.next({ currentPage: 0 });
      this.table.offset = 0;
    });
  }
  @ViewChild('colCreatedAt', { static: true }) colCreatedAt!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true })
  statusTemplate!: TemplateRef<any>;
  @ViewChild('actionTemplate', { static: true })
  public actionTemplate: TemplateRef<any>;
  //Comment
  initTable() {
    this.columns = [
      {
        prop: 'name',
        name: 'Khách hàng',
        sortable: true,
        canAutoResize: true,
        width: 150,
      },
      {
        prop: 'feedBack',
        name: 'Nội dung phản hồi',
        sortable: true,
        canAutoResize: true,
        width: 300,
      },
      {
        prop: 'rating',
        name: 'Đánh giá',
        sortable: true,
        canAutoResize: true,
        width: 60,
        headerClass: 'd-flex justify-content-center',
        cellClass: 'd-flex justify-content-center',
      },
      {
        prop: 'createdDate',
        name: 'Ngày tạo',
        sortable: true,
        cellTemplate: this.colCreatedAt,
        canAutoResize: true,
        headerClass: 'd-flex justify-content-center',
        cellClass: 'd-flex justify-content-center',
        width: 60,
      },
      {
        prop: 'isFeedbackApproved',
        name: 'Trạng thái',
        sortable: true,
        width: 60,
        canAutoResize: true,
        headerClass: 'd-flex justify-content-center',
        cellClass: 'd-flex justify-content-center',
        cellTemplate: this.statusTemplate,
      },
      {
        prop: 'action',
        width: 80,
        name: 'Hành động',
        sortable: false,
        canAutoResize: true,
        cellTemplate: this.actionTemplate,
        headerClass: 'd-flex justify-content-center',
        cellClass: 'd-flex justify-content-center',
      },
    ];
  }

  columns: TableColumn[] = [];
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  status: { id: string; value: string }[] = [];

  get metadata$(): Observable<PagingMetadata> {
    return this.commentListState.select('metadata');
  }
  get loading$(): Observable<boolean> {
    return this.commentListState.select('loading');
  }
  get comments$(): Observable<Comment[]> {
    return this.commentListState.select('comments').pipe(tap(data=>console.log(data)));
  }

  get metadataComment$(): Observable<PagingMetadata> {
    return this.commentListState.select('metadata');
  }
  get loadingComment$(): Observable<boolean> {
    return this.commentListState.select('loading');
  }

  searchComment$ = new BehaviorSubject<SearchInfo>({});
  searchFormComment = new FormGroup({
    keyword: new FormControl(),
    isFeedbackApproved: new FormControl(),
  });

  submitSearchComment$ = new Subject<
    Partial<{ keyword: string; isFeedbackApproved: string }>
  >();
  resetSearchComment$ = new Subject<void>();

  onPage(paging: PageInfo) {
    this.searchComment$.next({
      ...this.searchComment$.getValue(),
      currentPage: paging.offset,
    });
  }
  onSort(event: SortInfo) {
    this.table.offset - 1;
    this.searchComment$.next({
      ...this.searchComment$.getValue(),
      sort: { sortBy: event.column.prop, dir: event.newValue },
    });
  }

  approveFeedback(id: string) {
    this.commentService.updateApprove(id).subscribe((data) => {
      if (data == null) {
        setTimeout(() => window.location.reload(), 3000);
        this.toast.success('Duyệt thành công phản hồi!');
      }
    });
  }
}
