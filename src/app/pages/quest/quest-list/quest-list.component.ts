import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import {
  ColumnChangesService,
  DatatableComponent,
  SelectionType,
  TableColumn,
} from '@swimlane/ngx-datatable';
import {
  BehaviorSubject,
  Observable,
  shareReplay,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import {
  IdValue,
  Paging,
  PagingMetadata,
  Quest,
  QuestListItem,
  QuestListSearch,
} from 'src/app/models';
import { QuestService } from 'src/app/services';
import { PageInfo, SortInfo } from 'src/app/types';
import { QuestState, QUEST_STATE } from '../states/quest.state';
import { QuestListState } from '../states/questlist.state';

declare type FormType = {
  keyword: string;
  categories: number[];
};

@Component({
  selector: 'app-quest-list',
  templateUrl: './quest-list.component.html',
  styleUrls: ['./quest-list.component.scss'],
})
export class QuestListComponent implements OnInit {
  // records: QuestListItem[] = [];

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
    // this.records = [...Array(50).keys()].map(
    //   (i) =>
    //     ({
    //       index:++i,
    //       id: i,
    //       title: 'string',
    //       description: 'string',
    //       price: i,
    //       estimatedTime: '120',
    //       estimatedDistance: 'string',
    //       availableTime: new Date(),
    //       createdDate: new Date(),
    //       updatedDate: new Date(),
    //       status: 'string',
    //       questTypeId: 1,
    //       questOwnerId: 2,
    //       areaId: 2,
    //     } as QuestListItem)
    // );

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
      //submit reset nhay ve page 0
      this.search$.next({
        ...this.search$.getValue(),
        ...form,
        currentPage: 0,
      }),
        (this.table.offset = 0);
    });

    this.questListState.hold(this.resetSearch$, () => {
      this.searchForm.reset();
      this.submitSearch$.next({});
      this.table.offset = 0;
    });
  }

  initTable() {
    this.columns = [
      {
        prop: 'index',
        name: 'STT',
        sortable: true,
        canAutoResize: true,
        maxWidth: 75,
      },
      {
        prop: 'title',
        name: 'Tên quest',
        sortable: true,
        canAutoResize: true,
      },
      // {
      //   prop: 'description',
      //   name: 'Mô tả',
      //   sortable: true,
      //   minWidth: 600,
      // },
      {
        prop: 'price',
        name: 'Giá',
        sortable: true,
        maxWidth: 150,
      },
      {
        prop: 'estimatedTime',
        name: 'Ước lượng',
        sortable: true,
        maxWidth: 150,
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
        name: 'Trạng thái',
        sortable: true,
        maxWidth: 150,
      },
      // {
      //   prop: 'questOwnerId',
      //   maxWidth: 350,
      //   name: 'Quest owner',
      //   sortable: true,
      // },
      {
        prop: 'areaId',
        maxWidth: 200,
        name: 'Khu vực',
        sortable: true,
        cellTemplate:this.edit,
      },
    ];
  }

  @ViewChild('edit', { static: true }) edit!: TemplateRef<any>;
  // @ViewChild('deleteBtn', { static: true }) deleteBtn!: TemplateRef<any>;
  // selected = [];

  onActivate(event: any) {
    // console.log('Activate Event', event);
    if (event.type == 'click') {
      console.log(event.row);
      this.router.navigate(['./', event.row.id], {
        relativeTo: this.activatedRoute,
      });
    }
  }
  // onSelect({ selected }: any) {
  //   console.log('Select Event', selected, this.selected);
  // }

  // SelectionType = SelectionType;

  onPage(paging: PageInfo) {
    // console.log(paging);
    this.search$.next({
      ...this.search$.getValue(),
      currentPage: paging.offset,
    });
  }
  onSort(event: SortInfo) {
    // console.log(event);
    this.table.offset - 1;
    this.search$.next({
      ...this.search$.getValue(),
      sort: { sortBy: event.column.prop, dir: event.newValue },
    });
  }
  get questTypeIds(): Observable<IdValue[]> {
    return this.questState.select('questTypeIds');
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
