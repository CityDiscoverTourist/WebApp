import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableColumn } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import { LocationIndex, SearchInfo } from 'src/app/models';
import { PageInfo, SortInfo } from 'src/app/types';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss'],
})
export class LocationListComponent implements OnInit {
  records: LocationIndex[] = [];
  @ViewChild('colCreatedAt', { static: true }) colCreatedAt!: TemplateRef<any>;
  // columns: any[] = [
  columns: TableColumn[];
  constructor(
  ) {
    this.connect();
  }

  ngOnInit(): void {
    // this.records = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
    this.records = [...Array(50).keys()].map(
      (i) =>
        ({
          id: `${i} id`,
          name: `${i} name`,
          description: `${i} description`,
          longitude: `${i} longitude `,
          latitude: `${i} latitude`,
          address: `${i} address`,
          status: `${i} status`,
          areaId: i * 2,
          locationTypeId: i * 3,
        } as LocationIndex)
    );
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
    this.search$.next({page:paging.offset});
  }
  onSort(event:SortInfo){
    console.log(event);
    this.search$.next({sort:{sortBy:event.column.prop,dir:event.newValue}});
  }

  search$=new Subject<SearchInfo>();
  connect(){
    
  }
}
