import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { TableColumn } from '@swimlane/ngx-datatable';
import { Observable } from 'rxjs';
import { AreaListItem, IdValue } from 'src/app/models';
import { AreaService } from 'src/app/services/area.service';
import { PageInfo, SortInfo } from 'src/app/types';
import { AreaListPageState, AreaListState, AREA_PAGE_STATE } from './states';

@Component({
  selector: 'app-area-list',
  templateUrl: './area-list.component.html',
  styleUrls: ['./area-list.component.scss']
})
export class AreaListComponent implements OnInit {
  records :AreaListItem[]= [];
  @ViewChild('colCreatedAt', { static: true }) colCreatedAt!: TemplateRef<any>;
  // columns: any[] = [
  columns: TableColumn[];
  constructor(
    @Inject(AREA_PAGE_STATE)private areaPageState:RxState<AreaListPageState>,
    private areaSerice:AreaService,
    private areaListState:RxState<AreaListState>,
  ) {
  }

  ngOnInit(): void {
    this.records=[...Array(50).keys()].map(i=>({
      id: i,
      name: "ssss",
      status: "sss",
      cityId: i*3
    }) as AreaListItem);
    this.initTable();
  }
  initTable() {
    this.columns = [
      {
        prop: 'name',
        name: 'Tên khu vực',
        sortable: true,
        canAutoResize:true,
      },
      {
        prop: 'status',
        // canAutoResize: true,
        maxWidth: 300,
        name: 'Trạng thái',
        sortable: true,
      },
      {
        prop: 'cityId',
        maxWidth: 350,
        name: 'Thành phố',
        sortable: true,
      },
      
    ];
  }

  onPage(paging: PageInfo) {
    console.log(paging);
    // this.search$.next({page:paging.offset});
    // this.search$.next({...this.search$.getValue(),page:paging.offset});
    //doi cho map vs cai SearchInfo va Pagingmetadata  currentPage: number;
    // this.search$.next({...this.search$.getValue(),currentPage:paging.offset});
    
    

  }
  onSort(event:SortInfo){
    console.log(event);
    // this.search$.next({sort:{sortBy:event.column.prop,dir:event.newValue}});
    // this.search$.next({...this.search$.getValue(),sort:{sortBy:event.column.prop,dir:event.newValue}});
  }

  get citytypes$():Observable<IdValue[]>{
    return this.areaPageState.select('citytypes');
  }
}