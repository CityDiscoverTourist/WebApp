import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RxState } from '@rx-angular/state';
import { DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';
import { BehaviorSubject, Observable, Subject, switchMap, tap } from 'rxjs';
import { City, CityListItem, PagingMetadata, SearchInfo } from 'src/app/models';
import { CityService } from 'src/app/services';
import { PageInfo, SortInfo } from 'src/app/types';
import { CityListState } from '../states';
@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.scss'],
  providers:[RxState]
})
export class CityListComponent implements OnInit {
  records: CityListItem[] = [];
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  columns: TableColumn[] = [];
  constructor(
    private cityListState: RxState<CityListState>,
    private cityService: CityService
  ) {}
  ngOnInit(): void {
    // this.records = [...Array(50).keys()].map(
    //   (i) =>
    //     ({
    //       index:++i,
    //       id: i,
    //       name: 'i',
    //       status: 'i',
    //     } as CityListItem)
    // );

    this.initTable();
    this.cityListState.connect(
      this.search$
        .pipe(
          tap(() => this.cityListState.set({ loading: true })),
          switchMap((s) => this.cityService.getCities(s))
        ),
      (_, result) => ({
        cities: result.data.map(
          (x, i) =>
            ({
              index: ++i,
              id: x.id,
              name: x.name,
              status: x.status,
            } as CityListItem)
        ),
        metadata: { ...result.pagination },
        loading: false,
      })
    );
  }
  
  initTable() {
    this.columns = [
      {
        prop: 'index',
        name: 'STT',
        sortable: true,
        width: 50,
      },
      {
        prop: 'name',
        name: 'Tên thành phố',
        sortable: true,
        minWidth: 500,
      },
      {
        prop: 'status',
        minWidth: 350,
        name: 'Trạng thái',
        sortable: true,
      },
    ];
  }

  get cities$(): Observable<CityListItem[]> {
    return this.cityListState.select('cities').pipe(
      tap((data) => {
        console.log('data');
        console.log(data);
      })
    );
  }
  get metadata$(): Observable<PagingMetadata> {
    return this.cityListState.select('metadata');
  }
  get loading$(): Observable<boolean> {
    return this.cityListState.select('loading');
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
    this.table.offset - 1;
    this.search$.next({
      ...this.search$.getValue(),
      sort: { sortBy: event.column.prop, dir: event.newValue },
    });
  }

  search$ = new BehaviorSubject<SearchInfo>({});
  searchForm = new FormGroup({
    keyword: new FormControl(),
  });

  submitSearch$ = new Subject<Partial<{ keyword: string }>>();
  resetSearch$ = new Subject<void>();
}
