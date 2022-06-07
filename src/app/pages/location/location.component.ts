import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { id, TableColumn } from '@swimlane/ngx-datatable';
import { LocationListItem } from 'src/app/models';
import { LocationService } from 'src/app/services/location.service';
import { LocationtypeService } from 'src/app/services/locationtype.service';
import { LocationListPageState, LOCATION_PAGE_STATE } from './location-list/states/locationListPage.state';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  providers:[RxState]
})
export class LocationComponent implements OnInit {
//   records :LocationIndex[]= [];
//   @ViewChild('colCreatedAt', { static: true }) colCreatedAt!: TemplateRef<any>;
//   // columns: any[] = [
//   columns: TableColumn[];
//   constructor() {
//   }
ngOnInit(): void {
  
}
//   ngOnInit(): void {
//     this.records=[1,2,3,4,5,6,7,8,9,10].map(i=>({
//       id:`${i}`,
//       name:`Thành phố Hồ Chí Minh`,
//       status:`${i} status`,
//       createdAt:new Date(),
//     } as LocationIndex));
//     this.initTable();
//   }
//   initTable(){
//     this.columns=[
//       // {
//       //   prop: 'image',
//       // },
//       {
//         prop: 'name',
//         canAutoResize: true,
//         name:"Tên khu vực"
//       },
//       {
//         prop: 'status',
//         // canAutoResize: true,
//         maxWidth:400,
//         name:'Trạng thái',
//         sortable:false
//       },
//       {
//         prop: 'createdAt',
//         maxWidth:400,
//         cellTemplate:this.colCreatedAt,
//         name:'Ngày tạo',
//         sortable:false,
//       },
//     ];
//   }

//   onPage(event: any) {}

constructor(private readonly locationTypeService:LocationtypeService,
  @Inject(LOCATION_PAGE_STATE) locationPageState:RxState<LocationListPageState>){
    // locationPageState.connect(locationTypeService.getLocationTypes(),
    // (_,curr)=>({
    //   locationtypes:curr
    // }));
}
}
