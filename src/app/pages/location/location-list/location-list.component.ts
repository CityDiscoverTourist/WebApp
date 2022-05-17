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
    this.records = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
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
      // {
      //   prop: 'image',
      // },
      {
        prop: 'name',
        canAutoResize: true,
        name: 'Tên khu vực',
      },
      {
        prop: 'description',
        canAutoResize: true,
        name: 'Mô tả',
      },
      {
        prop: 'longitude',
        canAutoResize: true,
        name: 'longitude',
      },
      {
        prop: 'status',
        // canAutoResize: true,
        maxWidth: 400,
        name: 'Trạng thái',
        sortable: false,
      },
      {
        prop: 'createdAt',
        maxWidth: 400,
        cellTemplate: this.colCreatedAt,
        name: 'Ngày tạo',
        sortable: false,
      },
    ];
  }

  onPage(event: any) {}
}
