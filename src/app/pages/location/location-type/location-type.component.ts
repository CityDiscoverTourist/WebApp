import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableColumn } from '@swimlane/ngx-datatable';
import { LocationTypeIndex } from 'src/app/models';

@Component({
  selector: 'app-location-type',
  templateUrl: './location-type.component.html',
  styleUrls: ['./location-type.component.scss']
})
export class LocationTypeComponent implements OnInit {

  records :LocationTypeIndex[]= [];
  @ViewChild('colCreatedAt', { static: true }) colCreatedAt!: TemplateRef<any>;
  // columns: any[] = [
  columns: TableColumn[];
  constructor() {
  }

  ngOnInit(): void {
    this.records=[1,2,3,4,5,6,7,8,9,10].map(i=>({
      id:`${i}`,
      name:`Thành phố Hồ Chí Minh`,
      status:`${i} status`,
      createdAt:new Date(),
    } as LocationTypeIndex));
    this.initTable();
  }
  initTable(){
    this.columns=[
      // {
      //   prop: 'image',
      // },
      {
        prop: 'name',
        canAutoResize: true,
        name:"Tên khu vực"
      },
      {
        prop: 'status',
        // canAutoResize: true,
        maxWidth:400,
        name:'Trạng thái',
        sortable:false
      },
      {
        prop: 'createdAt',
        maxWidth:400,
        cellTemplate:this.colCreatedAt,
        name:'Ngày tạo',
        sortable:false,
      },
    ];
  }

  onPage(event: any) {}
}
