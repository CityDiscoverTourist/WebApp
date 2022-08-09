import {
  Component,
  Inject,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
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
  encapsulation: ViewEncapsulation.None,
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
        quests: result.data,
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

  
  @ViewChild('edit', { static: true }) edit!: TemplateRef<any>;
  @ViewChild('formatPrice', { static: true }) formatPrice!: TemplateRef<any>;
  @ViewChild('formatStatus', { static: true }) formatStatus!: TemplateRef<any>;
  @ViewChild('formatestimatedTime', { static: true }) formatestimatedTime!: TemplateRef<any>;
  @ViewChild('nameProduct', { static: true }) nameProduct!: TemplateRef<any>;

  initTable() {
    this.columns = [
      {
        prop: 'title',
        name: 'Tên Quest',
        sortable: true,
        canAutoResize: true,
        cellTemplate:this.nameProduct
      },
      
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
      {
        prop: 'createdDate',
        name: 'Ngày tạo',
        sortable: true,
        maxWidth: 100,
        cellTemplate: this.colCreatedAt,
      }, 
      {
        prop: 'status',
        name: 'Trạng Thái',
        sortable: true,
        maxWidth: 160,
        cellTemplate: this.formatStatus,
      },
      
    ];
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
      .select('questTypeIds');
  }

  searchForm = new FormGroup({
    keyword: new FormControl(),
    questTypeIds: new FormControl(),
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
};
