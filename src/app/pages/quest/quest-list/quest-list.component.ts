import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RxState } from '@rx-angular/state';
import { DatatableComponent, TableColumn } from '@swimlane/ngx-datatable';
import {
  BehaviorSubject,
  Observable,
  shareReplay,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { Quest, QuestListItem, QuestListSearch } from 'src/app/models';

declare type FormType = {
  keyword: string;
  categories: number[];
};

@Component({
  selector: 'app-quest-list',
  templateUrl: './quest-list.component.html',
  styleUrls: ['./quest-list.component.scss'],
})
export class QuestListComponent implements OnInit {
  records: QuestListItem[] = [];

  @ViewChild('colCreatedAt', { static: true }) colCreatedAt!: TemplateRef<any>;
  columns: TableColumn[] = [];

  @ViewChild(DatatableComponent) table!: DatatableComponent;

  constructor() {}

  // onReset() {
  //   this.searchForm.reset();
  //   this.search$.next({}); //ve page 1
  // }

  ngOnInit(): void {
    this.records = [...Array(50).keys()].map(
      (i) =>
        ({
          index:++i,
          id: i,
          title: 'string',
          description: 'string',
          price: i,
          estimatedTime: '120',
          estimatedDistance: 'string',
          availableTime: new Date(),
          createdDate: new Date(),
          updatedDate: new Date(),
          status: 'string',
          questTypeId: 1,
          questOwnerId: 2,
          areaId: 2,
        } as QuestListItem)
    );
    this.initTable();
  }

  initTable() {
    this.columns = [
      {
        prop: 'index',
        name: 'STT',
        sortable: true,
        canAutoResize: true,
        maxWidth:75
      },
      {
        prop: 'title',
        name: 'Tên quest',
        sortable: true,
        canAutoResize: true,
      },
      {
        prop: 'description',
        name: 'Mô tả',
        sortable: true,
        canAutoResize: true,
      },
      {
        prop: 'price',
        name: 'Giá',
        sortable: true,
        canAutoResize: true,
      },
      {
        prop: 'estimatedTime',
        name: 'Ước lượng',
        sortable: true,
        canAutoResize: true,
      },
      {
        prop: 'estimatedDistance',
        name: 'Khoảng cách',
        sortable: true,
        canAutoResize: true,
      },
      {
        prop: 'availableTime',
        name: 'Khả dụng',
        sortable: true,
        canAutoResize: true,
      },
      {
        prop: 'createdDate',
        name: 'Ngày tạo',
        sortable: true,
        canAutoResize: true,
        cellTemplate: this.colCreatedAt,
      },
      {
        prop: 'updatedDate',
        name: 'Ngày sửa',
        sortable: true,
        canAutoResize: true,
        cellTemplate: this.colCreatedAt,
      },
      {
        prop: 'status',
        maxWidth: 300,
        name: 'Trạng thái',
        sortable: true,
      },
      // {
      //   prop: 'questTypeId',
      //   maxWidth: 350,
      //   name: 'Loại',
      //   sortable: true,
      // },
      {
        prop: 'questOwnerId',
        maxWidth: 350,
        name: 'Quest owner',
        sortable: true,
      },
      {
        prop: 'areaId',
        maxWidth: 350,
        name: 'Khu vực',
        sortable: true,
      },

    ];
  }

  // onPage(paging: PagingInfo) {
  //   console.log(paging);
  //   this.search$.next({
  //     ...this.search$.getValue(),
  //     currentPage: paging.offset,
  //   });
  // }
  // onSort(event: SortInfo) {
  //   this.search$.next({
  //     ...this.search$.getValue(),
  //     sortBy: event.column.prop,
  //     sortDir: event.newValue,
  //   });
  // }
}
