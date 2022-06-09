import { ChangeDetectionStrategy, Component, Inject, INJECTOR, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RxState } from '@rx-angular/state';
import { DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';
import { BehaviorSubject, mergeMap, Observable, of, retry, Subject, switchMap, tap } from 'rxjs';
import { IdValue, LocationListItem, PagingMetadata, SearchInfo } from 'src/app/models';
import { LocationService } from 'src/app/services/location.service';
import { PageInfo, SortInfo } from 'src/app/types';

import { LocationListSearch } from 'src/app/models';
import { LocationState, LOCATION_STATE } from '../states/location.state';
import { LocationListState } from '../states/locationlist.state';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush,
  providers:[RxState]
})
export class LocationListComponent implements OnInit {
  // records: LocationListItem[] = [];
  @ViewChild('colCreatedAt', { static: true }) colCreatedAt!: TemplateRef<any>;
  // columns: any[] = [
  columns: TableColumn[];
  constructor(
    @Inject(LOCATION_STATE)private locationPageState:RxState<LocationState>,
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
        getLocations(s)),
      ),
      (_,result)=>({
        locations:result.records,
        // metadata:result.metadata
        //doi sau current page
        // metadata:{...result.metadata}
      })
    )
    //bam nut cap nhat lai cai search hold ko thay doi state
    this.locationListState.hold(
      this.submitSearch$,
    // (form:FormGroup)=>this.search$.next({...this.search$.getValue(),...form. value,page:0}),);
    // (form:FormGroup)=>this.search$.next({...this.search$.getValue(),...form. value}),);
    // (form:FormGroup)=>this.search$.next({...this.search$.getValue(),...form. value,page:{currentPage:0}}),);
    //edit the declre type cho de
    // (form:{keyword:string, locationtypes:number[]})=>
    (form)=>{
    // this.search$.next({...this.search$.g
    //submit reset nhay ve page 0
  this.search$.next({...this.search$.getValue(),...form,currentPage:0}),this.table.offset=0;});
    // (form:{keyword:string, locationtypes:number[]})=>this.search$.next({...this.search$.getValue(),...form, value,page:{currentPage:0}}),);
    
// nhay ve page 1
//them hold ko can update metadata
// this.locationListState.connect(
//   this.resetSearch$,
//   (prev,_)=>({
//     metadata:{...prev.metadata, currentPage:0}
//   })
// )

    this.locationListState.hold(
      this.resetSearch$,
      ()=>{
        this.searchForm.reset();
        //reset ve trang 1
       this.submitSearch$.next({})
        this.table.offset=0;
        // this.search$.next({})
      }
    )
    https://www.youtube.com/watch?v=nTVjAiyycq8&t=3s
    53
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
    console.log(paging);
    // this.search$.next({page:paging.offset});
    // this.search$.next({...this.search$.getValue(),page:paging.offset});
    //doi cho map vs cai SearchInfo va Pagingmetadata  currentPage: number;
    this.search$.next({...this.search$.getValue(),currentPage:paging.offset});
    
    

  }
  onSort(event:SortInfo){
    console.log(event);
    // this.search$.next({sort:{sortBy:event.column.prop,dir:event.newValue}});
    this.search$.next({...this.search$.getValue(),sort:{sortBy:event.column.prop,dir:event.newValue}});
  }

  search$=new BehaviorSubject<LocationListSearch>({});
  get locationtypes$():Observable<IdValue[]>{
    return this.locationPageState.select('locationTypeIds');
  }
  connect(){
    
  }

  searchForm=new FormGroup({
    keyword:new FormControl(),
    locationtypes:new FormControl()
  })

  // submitSearch$=new Subject<FormGroup|null>();//tam thoi bi loi ne xoa (click)="submitSearch$.next(null)"
  //submitSearch$=new Subject<FormGroup>();//tam thoi bi loi ne xoa (click)="submitSearch$.next(null)"
  submitSearch$=new Subject<Partial<FromType>>()
  // submitSearch$=new Subject<FromType>()

  get locations$():Observable<LocationListItem[]>{
    return this.locationListState.select('locations');
  }

  resetSearch$ =new Subject<void>();
t2=0;
  get metadata$():Observable<PagingMetadata>{
    console.log(`getting metadata ${this.t2++}`);
    
    return this.locationListState.select('metadata').pipe(tap(m=>console.log(m)
    ));
  }
  
  @ViewChild(DatatableComponent) table!: DatatableComponent;

}

declare type FromType={
  keyword:string;
  locationtypes:number[];
}