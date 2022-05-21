import { ChangeDetectorRef, Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RxState } from '@rx-angular/state';
import { DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';
import { BehaviorSubject, Observable, shareReplay, Subject, switchMap, tap } from 'rxjs';
// import { IdValue, PagingMetadata, PagingRequest, QuestListItem, QuestListSearch } from 'src/app/models';
import { Quest, QuestListItem, QuestListSearch } from 'src/app/models';
import { QuestService } from 'src/app/services';
// import { PagingInfo, SortInfo } from 'src/app/types';
import { SortInfo } from 'src/app/types';

declare type FormType = {
  keyword: string;
  categories: number[];
};

import {
  QuestListPageState,
  QuestListState,
  QUEST_PAGE_STATE,
} from './states';


@Component({
  selector: 'app-quest-list',
  templateUrl: './quest-list.component.html',
  styleUrls: ['./quest-list.component.scss'],
})
export class QuestListComponent implements OnInit {

  records: Quest[] = [];

  @ViewChild('colCreatedAt', { static: true }) colCreatedAt!: TemplateRef<any>;
  columns: TableColumn[] = [];

  searchForm = new FormGroup({
    // keyword: new FormControl(),
    // categories: new FormControl(),
  });

  // search$ = new BehaviorSubject<PagingRequest<QuestListSearch>>({});

  // submitSearch$ = new Subject<Partial<FormType>>();
  // resetSearch$ = new Subject<void>();

  // get categories$(): Observable<IdValue[]> {
  //   // console.log(`get categories`, this.tmp++);
  //   // console.log(this.productPageState.select('categories'));
  //   return this.productPageState.select('categories').pipe(shareReplay(1)); //todo: recheck getter with change detection
  // }

  // get product$(): Observable<QuestListItem[]> {
  //   return this.productListState.select('products').pipe(shareReplay(1));
  // }
  // get metadata$(): Observable<PagingMetadata> {
  //   return this.productListState.select('metadata').pipe(shareReplay(1));
  //   // .pipe(tap(m=>console.log(`metadata`,m)
  //   // )
  //   // );
  // }

  get loading$(): Observable<boolean> {
    return this.productListState.select('loading').pipe(shareReplay(1));
  }

  @ViewChild(DatatableComponent) table!: DatatableComponent;

  constructor(
    @Inject(QUEST_PAGE_STATE)
    private productPageState: RxState<QuestListPageState>,
    private productListState: RxState<QuestListState>,
    private questService: QuestService,
    private cd: ChangeDetectorRef
  ) {}

  // onReset() {
  //   this.searchForm.reset();
  //   this.search$.next({}); //ve page 1
  // }

  ngOnInit(): void {
 
    // this.productListState.hold(this.submitSearch$, (form) => {
    //   this.search$.next({
    //     ...this.search$.getValue(),
    //     ...form,
    //     currentPage: 0,
    //   }),
    //     //#25
    //     this.table.offset;
    // });
    // this.productListState.connect(this.resetSearch$, (prev, _) => ({
    //   metadata: { ...prev.metadata, currentPage: 0 },
    // }));

    // //reset
    // this.productListState.hold(this.resetSearch$, () => {
    //   this.searchForm.reset();
    //   this.search$.next({ currentPage: 0 });
    //   this.table.offset = 0;
    // });

    this.initTable();
    this.questService.getQuests().subscribe(data=>{
      console.log(data);
      
      this.records=data;
    })
  }

  initTable() {
    this.columns = [
      {
        prop: 'id',
        name:'STT',
        width: 50,
        maxWidth: 80,
        sortable: false,
      },
      {
        prop: 'title',
        // flexGrow:1,
          name:'Tên',
        canAutoResize: true,
        sortable: false,
      },
      {
        prop: 'description',
        canAutoResize: true,
        sortable: false,
      },
      {
        prop: 'price',
        maxWidth: 200,
        sortable: false,
      },
      {
        prop: 'estimatedTime',
        name: 'Available',
        maxWidth: 120,
        sortable: true,
      },
      {
        prop: 'createdDate',
        cellTemplate: this.colCreatedAt,
        maxWidth: 120,
        sortable: true,
      },
      {
        prop: 'availableTime',
        cellTemplate: this.colCreatedAt,
        sortable: true,
        maxWidth: 120,
      },
    ];
  }

  // onPage(paging: PagingInfo) {
  //   console.log(paging);
  //   this.search$.next({
  //     ...this.search$.getValue(),
  //     currentPage: paging.offset,
  //   });
  // }
  // onSort(event: SortInfo) {
  //   this.search$.next({
  //     ...this.search$.getValue(),
  //     sortBy: event.column.prop,
  //     sortDir: event.newValue,
  //   });
  // }
}