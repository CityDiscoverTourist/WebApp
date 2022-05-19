import {
  Component,
  Inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RxState } from '@rx-angular/state';
import { DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';
import { BehaviorSubject, Observable, Subject, switchMap, tap } from 'rxjs';
import {
  AreaListItem,
  AreaListSearch,
  IdValue,
  PagingMetadata,
} from 'src/app/models';
import { AreaService } from 'src/app/services/area.service';
import { PageInfo, SortInfo } from 'src/app/types';
import { AreaListPageState, AreaListState, AREA_PAGE_STATE } from './states';

@Component({
  selector: 'app-area-list',
  templateUrl: './area-list.component.html',
  styleUrls: ['./area-list.component.scss'],
})
export class AreaListComponent implements OnInit {
  records: AreaListItem[] = [];
  @ViewChild('colCreatedAt', { static: true }) colCreatedAt!: TemplateRef<any>;
  // columns: any[] = [
  columns: TableColumn[];
  constructor(
    @Inject(AREA_PAGE_STATE) private areaPageState: RxState<AreaListPageState>,
    private areaSerice: AreaService,
    private areaListState: RxState<AreaListState>
  ) {
    console.log('xxxxxxxxxxxxxxx');
    this.search$.subscribe((x) => console.log(x));
    console.log('xxxxxxxxxxxxxxxy');
    this.submitSearch$.subscribe((x) => {
      console.log(x);
      console.log('sss');
    });
  }

  ngOnInit(): void {
    // this.records = [...Array(50).keys()].map(
    //   (i) =>
    //     ({
    //       id: i,
    //       name: 'ssss',
    //       status: 'sss',
    //       cityId: i * 3,
    //     } as AreaListItem)
    // );
    this.initTable();

    this.areaListState.connect(
      this.search$.pipe(switchMap((s) => this.areaSerice.getAreas(s))),
      (_, result) => ({
        areas: result.records,
        metadata: { ...result.metadata },
      })
    );
    //bam nut cap nhat lai cai search hold ko thay doi state
    this.areaListState.hold(this.submitSearch$, (form) => {
      //submit reset nhay ve page 0
      this.search$.next({
        ...this.search$.getValue(),
        ...form,
        currentPage: 0,
      }),
        (this.table.offset = 0);
    });

    // nhay ve page 1
    //them hold ko can update metadata
    // this.locationListState.connect(
    //   this.resetSearch$,
    //   (prev,_)=>({
    //     metadata:{...prev.metadata, currentPage:0}
    //   })
    // )

    this.areaListState.hold(this.resetSearch$, () => {
      this.searchForm.reset();
      //reset ve trang 1
      this.submitSearch$.next({});
      this.table.offset = 0;
      // this.search$.next({})
    });
  }
  initTable() {
    this.columns = [
      {
        prop: 'name',
        name: 'Tên khu vực',
        sortable: true,
        canAutoResize: true,
      },
      {
        prop: 'status',
        // canAutoResize: true,
        maxWidth: 300,
        name: 'Trạng thái',
        sortable: true,
      },
      {
        prop: 'cityId',
        maxWidth: 350,
        name: 'Thành phố',
        sortable: true,
      },
    ];
  }

  onPage(paging: PageInfo) {
    console.log(paging);
    this.search$.next({
      ...this.search$.getValue(),
      currentPage: paging.offset,
    });
  }
  onSort(event: SortInfo) {
    console.log(event);
    this.search$.next({
      ...this.search$.getValue(),
      sort: { sortBy: event.column.prop, dir: event.newValue },
    });
  }

  get citytypes$(): Observable<IdValue[]> {
    return this.areaPageState.select('citytypes');
  }

  get areas$(): Observable<AreaListItem[]> {
    return this.areaListState.select('areas');
  }

  searchForm = new FormGroup({
    keyword: new FormControl(),
    citytypes: new FormControl(),
  });
  submitSearch$ = new Subject<Partial<FromType>>();
  search$ = new BehaviorSubject<AreaListSearch>({});

  resetSearch$ = new Subject<void>();

  get metadata$(): Observable<PagingMetadata> {
    // console.log(`getting metadata`);

    return this.areaListState.select('metadata');
    // .pipe(tap((m) => console.log(m)));
  }
  @ViewChild(DatatableComponent) table!: DatatableComponent;
}

declare type FromType = {
  keyword: string;
  locationtypes: number[];
};
