import {
  AfterViewInit,
  Component,
  Inject,
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
  IdValue,
  PagingMetadata,
  QuestListItem,
  QuestListSearch,
} from 'src/app/models';
import { QuestService } from 'src/app/services';
import { PageInfo, SortInfo } from 'src/app/types';
import { QuestState, QUEST_STATE } from '../states/quest.state';
import { QuestListState } from '../states/questlist.state';

declare type language = {
  id: string;
  value: string;
};

@Component({
  selector: 'app-quest-list',
  templateUrl: './quest-list.component.html',
  styleUrls: ['./quest-list.component.scss'],
})
export class QuestListComponent implements OnInit {
  language: language[] = [
    { id: '0', value: 'Tiếng Anh' },
    { id: '1', value: 'Tiếng Việt' },
  ];

  @ViewChild('colCreatedAt', { static: true }) colCreatedAt!: TemplateRef<any>;
  columns: TableColumn[] = [];

  @ViewChild(DatatableComponent) table!: DatatableComponent;

  constructor(
    @Inject(QUEST_STATE) private questState: RxState<QuestState>,
    private questService: QuestService,
    private questListState: RxState<QuestListState>,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initTable();

    this.questListState.connect(
      this.search$.pipe(
        tap((_) => this.questListState.set({ loading: true })),
        switchMap((s) => this.questService.getQuests(s))
      ),
      (_, result) => ({
        quests: result.data.map(
          (x, index) =>
            ({
              index: ++index,
              id: x.id,
              title: x.title,
              description: x.description,
              price: x.price,
              estimatedTime: x.estimatedTime,
              estimatedDistance: x.estimatedDistance,
              availableTime: x.availableTime,
              createdDate: x.createdDate,
              updatedDate: x.updatedDate,
              status: x.status,
              questTypeId: x.questTypeId,
              questOwnerId: x.questOwnerId,
              areaId: x.areaId,
            } as QuestListItem)
        ),
        metadata: { ...result.pagination },
        loading: false,
      })
    );

    //update search
    this.questListState.hold(this.submitSearch$, (form) => {
      this.search$.next({
        ...this.search$.getValue(),
        ...form,
        currentPage: 0,
      }),
        (this.table.offset = 0);
    });

    this.questListState.connect(this.resetSearch$, (prev, _) => ({
      metadata: { ...prev.metadata, currentPage: 0 },
    }));

    this.questListState.hold(this.resetSearch$, () => {
      this.searchForm.reset();
      this.search$.next({ currentPage: 0 });
      this.table.offset = 0;
    });
  }

  initTable() {
    this.columns = [
      // {
      //   prop: 'index',
      //   name: 'STT',
      //   sortable: true,
      //   canAutoResize: true,
      //   maxWidth: 75,
      // },
      {
        prop: 'title',
        name: 'Tên Quest',
        sortable: true,
        canAutoResize: true,
      },
      // {
      //   prop: 'description',
      //   name: 'Mô tả',
      //   sortable: true,
      //   minWidth: 600,
      //   cellClass: '',
      // },
      {
        prop: 'price',
        name: 'Giá',
        sortable: true,
        maxWidth: 150,
        cellTemplate: this.formatPrice,
      },
      {
        prop: 'estimatedTime',
        name: 'Thời gian',
        sortable: true,
        maxWidth: 150,
        cellTemplate: this.formatestimatedTime,
      },
      // {
      //   prop: 'estimatedDistance',
      //   name: 'Khoảng cách',
      //   sortable: true,
      //   canAutoResize: true,
      // },
      // {
      //   prop: 'availableTime',
      //   name: 'Khả dụng',
      //   sortable: true,
      //   canAutoResize: true,
      // },
      // {
      //   prop: 'createdDate',
      //   name: 'Ngày tạo',
      //   sortable: true,
      //   canAutoResize: true,
      //   cellTemplate: this.colCreatedAt,
      // },
      // {
      //   prop: 'updatedDate',
      //   name: 'Ngày sửa',
      //   sortable: true,
      //   canAutoResize: true,
      //   cellTemplate: this.colCreatedAt,
      // },
      {
        prop: 'status',
        name: 'Trạng Thái',
        sortable: true,
        maxWidth: 150,
        cellTemplate: this.formatStatus,
      },
      // {
      //   prop: 'questOwnerId',
      //   maxWidth: 350,
      //   name: 'Quest owner',
      //   sortable: true,
      // },
      // {
      //   prop: 'areaId',
      //   maxWidth: 200,
      //   name: 'Khu vực',
      //   sortable: true,
      // },
    ];
  }

  @ViewChild('edit', { static: true }) edit!: TemplateRef<any>;
  @ViewChild('formatPrice', { static: true }) formatPrice!: TemplateRef<any>;
  @ViewChild('formatStatus', { static: true }) formatStatus!: TemplateRef<any>;
  @ViewChild('formatestimatedTime', { static: true })
  formatestimatedTime!: TemplateRef<any>;

  onActivate(event: any) {
    // console.log('Activate Event', event);
    if (event.type == 'click') {
      console.log(event.row);
      this.router.navigate(['./', event.row.id], {
        relativeTo: this.activatedRoute,
      });
    }
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
  get questTypeIds(): Observable<IdValue[]> {
    return this.questState
      .select('questTypeIds')
      .pipe(tap((data) => console.log(data)));
  }

  searchForm = new FormGroup({
    keyword: new FormControl(),
    questTypeIds: new FormControl(),
    language: new FormControl(),
  });
  search$ = new BehaviorSubject<QuestListSearch>({});

  get areas$(): Observable<QuestListItem[]> {
    return this.questListState.select('quests');
  }
  get metadata$(): Observable<PagingMetadata> {
    return this.questListState.select('metadata');
  }
  get loading$(): Observable<boolean> {
    return this.questListState.select('loading');
  }
  submitSearch$ = new Subject<Partial<FromType>>();
  resetSearch$ = new Subject<void>();
}

declare type FromType = {
  keyword: string;
  questTypeIds: number[];
  language: string;
};
