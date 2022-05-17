import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { id, TableColumn } from '@swimlane/ngx-datatable';
import { LocationIndex } from 'src/app/models';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
})
export class LocationComponent implements OnInit {
  records :LocationIndex[]= [];
  @ViewChild('colCreatedAt', { static: true }) colCreatedAt!: TemplateRef<any>;
  // columns: any[] = [
  columns: TableColumn[];
  constructor() {
  }

  ngOnInit(): void {
    this.records=[1,2,3,4,5].map(i=>({
      id:`${i}`,
      name:`${i} name`,
      status:`${i} status`,
      createdAt:new Date("20/5/2022"),
    } as LocationIndex));
    this.initTable();
  }
  initTable(){
    this.columns=[
      // {
      //   prop: 'image',
      // },
      {
        prop: 'name',
      },
      {
        prop: 'status',
      },
      {
        prop: 'createdAt',
        cellTemplate:this.colCreatedAt,
      },
    ];
  }

  onPage(event: any) {}
}
