import { ChangeDetectionStrategy, Component, Inject, INJECTOR, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RxState } from '@rx-angular/state';
import { TableColumn } from '@swimlane/ngx-datatable';
import { BehaviorSubject, mergeMap, Observable, of, Subject, switchMap } from 'rxjs';
import { IdValue, LocationListItem, SearchInfo } from 'src/app/models';
import { LocationService } from 'src/app/services/location.service';
import { PageInfo, SortInfo } from 'src/app/types';
import { LocationListPageState, LocationListState, LOCATION_PAGE_STATE } from './states';
import { LocationListSearch } from 'src/app/models';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss'],
  // changeDetection:ChangeDetectionStrategy.OnPush,
  providers:[RxState]
})
export class LocationListComponent implements OnInit {
  // records: LocationListItem[] = [];
  @ViewChild('colCreatedAt', { static: true }) colCreatedAt!: TemplateRef<any>;
  // columns: any[] = [
  columns: TableColumn[];
  constructor(
    @Inject(LOCATION_PAGE_STATE)private locationPageState:RxState<LocationListPageState>,
    private locationSerice:LocationService,
    private locationListState:RxState<LocationListState>,
  ) {
    // this.connect();
    console.log("-------");
    
    this.search$.subscribe(x=>console.log(x));
    console.log("----------");
    
    this.submitSearch$.subscribe(x=>console.log(x));
    
    //khi submit load data
    this.locationListState.connect(
      this.search$.pipe(switchMap(s=>this.locationSerice.
        getLocations({...s,...this.searchForm.value} as LocationListSearch)),
      ),
      (_,result)=>({
        locations:result.records,
        metadata:result.metadata
      })
    )
  }

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
        // cellClass:"ng-select text-size"
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
        // canAutoResize: true,
        maxWidth: 100,
        name: 'Trạng thái',
        sortable: true,
      },
      {
        prop: 'areaId',
        maxWidth: 100,
        name: 'Khu vực',
        sortable: true,
      },
      {
        prop: 'locationTypeId',
        maxWidth: 100,
        name: 'Loại vị trí',
        sortable: true,
      },
    ];
  }

  onPage(paging: PageInfo) {
    // console.log(paging);
    // this.search$.next({page:paging.offset});
    this.search$.next({...this.search$.getValue(),page:paging.offset});
    
    

  }
  onSort(event:SortInfo){
    // console.log(event);
    // this.search$.next({sort:{sortBy:event.column.prop,dir:event.newValue}});
    this.search$.next({...this.search$.getValue(),sort:{sortBy:event.column.prop,dir:event.newValue}});
  }

  search$=new BehaviorSubject<SearchInfo>({});
  get locationtypes$():Observable<IdValue[]>{
    return this.locationPageState.select('locationtypes');
  }
  connect(){
    
  }

  searchForm=new FormGroup({
    keyword:new FormControl(),
    locationtypes:new FormControl()
  })

  submitSearch$=new Subject<FormGroup|null>();

  get locations$():Observable<LocationListItem[]>{
    return this.locationListState.select('locations');
  }
  
}
