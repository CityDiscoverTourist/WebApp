import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TableColumn } from '@swimlane/ngx-datatable';
import { LocationIndex } from 'src/app/models';

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
  constructor() {}

  ngOnInit(): void {
    // this.records = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
    this.records = [...Array(10).keys()].map(
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
      },
      {
        prop: 'latitude',
        maxWidth: 120,
        name: 'Vĩ độ',
      },
      {
        prop: 'address',
        canAutoResize: true,
        name: 'Địa chỉ',
      },
      {
        prop: 'status',
        // canAutoResize: true,
        maxWidth: 100,
        name: 'Trạng thái',
        sortable: false,
      },
      {
        prop: 'areaId',
        maxWidth: 100,
        name: 'Khu vực',
        sortable: false,
      },
      {
        prop: 'locationTypeId',
        maxWidth: 100,
        name: 'Loại vị trí',
        sortable: false,
      },
    ];
  }

  onPage(event: any) {}
}
