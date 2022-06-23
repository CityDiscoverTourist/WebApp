import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-customer-task-list',
  templateUrl: './customer-task-list.component.html',
  styleUrls: ['./customer-task-list.component.scss'],
})
export class CustomerTaskListComponent implements OnInit {
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  columns: TableColumn[] = [];

  constructor() {}

  ngOnInit(): void {
    this.initTable();
  }

  initTable() {
    this.columns = [
      {
        prop: 'name',
        name: 'Tên khu vực',
        sortable: true,
        canAutoResize: true,
      },
      {
        prop: 'status',
        maxWidth: 300,
        name: 'Trạng thái',
        sortable: true,
      },
      {
        prop: 'cityId',
        maxWidth: 350,
        name: 'Thành phố',
        sortable: false,
      },

      {
        prop: 'action',
        minWidth: 180,
        name: 'Hành động',
        sortable: false,
        maxWidth: 200,
        canAutoResize: true,
        cellClass: 'align-items-center d-flex',
      },
    ];
  }
  submitSearch$ = new Subject<
    Partial<{ keyword: string; cityIds: number[] }>
  >();
  search$ = new BehaviorSubject<{}>({});
  resetSearch$ = new Subject<void>();
  searchForm = new FormGroup({
    keyword: new FormControl(),
    status: new FormControl(),
  });

  onUpdate(id: string) {}
  onDelete(id: string) {}
}
