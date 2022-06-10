import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  INJECTOR,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RxState } from '@rx-angular/state';
import { DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';
import {
  BehaviorSubject,
  mergeMap,
  Observable,
  of,
  retry,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import {
  IdValue,
  LocationListItem,
  PagingMetadata,
  SearchInfo,
} from 'src/app/models';
import { LocationService } from 'src/app/services/location.service';
import { PageInfo, SortInfo } from 'src/app/types';

import { LocationListSearch } from 'src/app/models';
import { LocationState, LOCATION_STATE } from '../states/location.state';
import { LocationListState } from '../states/locationlist.state';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class LocationListComponent implements OnInit {
  // records: LocationListItem[] = [];
  @ViewChild('colCreatedAt', { static: true }) colCreatedAt!: TemplateRef<any>;
  columns: TableColumn[];
  constructor(
    @Inject(LOCATION_STATE) private locationPageState: RxState<LocationState>,
    private locationSerice: LocationService,
    private locationListState: RxState<LocationListState>
  ) {}

  ngOnInit(): void {
    // this.records = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
    // this.records = [...Array(50).keys()].map(
    //   (i) =>
    //     ({
    //       id: `${i} id`,
    //       name: `${i} name`,
    //       description: `${i} description`,
    //       longitude: `${i} longitude `,
    //       latitude: `${i} latitude`,
    //       address: `${i} address`,
    //       status: `${i} status`,
    //       areaId: i * 2,
    //       locationTypeId: i * 3,
    //     } as LocationListItem)
    // );
    this.initTable();
  }
  initTable() {
    this.columns = [
      {
        prop: 'name',
        maxWidth: 250,
        name: 'Tên khu vực',
        sortable: true,
      },
      {
        prop: 'description',
        canAutoResize: true,
        name: 'Mô tả',
      },
      {
        prop: 'longitude',
        maxWidth: 120,
        name: 'Kinh độ',
        sortable: false,
      },
      {
        prop: 'latitude',
        maxWidth: 120,
        name: 'Vĩ độ',
        sortable: false,
      },
      {
        prop: 'address',
        canAutoResize: true,
        name: 'Địa chỉ',
        sortable: true,
      },
      {
        prop: 'status',
        maxWidth: 100,
        name: 'Trạng thái',
        sortable: true,
      },
      // {
      //   prop: 'areaId',
      //   maxWidth: 100,
      //   name: 'Khu vực',
      //   sortable: true,
      // },
      // {
      //   prop: 'locationTypeId',
      //   maxWidth: 100,
      //   name: 'Loại vị trí',
      //   sortable: true,
      // },
    ];
  }

  onPage(paging: PageInfo) {}
  onSort(event: SortInfo) {}

  search$ = new BehaviorSubject<LocationListSearch>({});
  get locationTypeIds$(): Observable<IdValue[]> {
    // return this.locationState.select('locationTypeIds');
    return of();
  }
  get areaIds$(): Observable<IdValue[]> {
    // return this.locationState.select('areaIds');
    return of();
  }

  searchForm = new FormGroup({
    keyword: new FormControl(),
    locationtypes: new FormControl(),
  });

  submitSearch$ = new Subject<Partial<FromType>>();

  get locations$(): Observable<LocationListItem[]> {
    return this.locationListState.select('locations');
  }

  resetSearch$ = new Subject<void>();
  get metadata$(): Observable<PagingMetadata> {
    return this.locationListState
      .select('metadata')
      .pipe(tap((m) => console.log(m)));
  }

  @ViewChild(DatatableComponent) table!: DatatableComponent;
}

declare type FromType = {
  keyword: string;
  locationtypes: number[];
};
