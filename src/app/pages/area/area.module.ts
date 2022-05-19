import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreaRoutingModule } from './area-routing.module';
import { AreaComponent } from './area.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AreaListPageState, AREA_PAGE_STATE } from './area-list/states';
import { RxState } from '@rx-angular/state';
const lib = [NgxDatatableModule];
@NgModule({
  declarations: [
    AreaComponent,
  ],
  imports: [
    CommonModule,
    AreaRoutingModule,
    ...lib,
  ],
  providers:[{
    provide:AREA_PAGE_STATE,
    useFactory:()=>new RxState<AreaListPageState>()
  }]
})
export class AreaModule { }
