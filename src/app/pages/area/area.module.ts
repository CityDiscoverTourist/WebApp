import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreaRoutingModule } from './area-routing.module';
import { AreaComponent } from './area.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { RxState } from '@rx-angular/state';
import { AreaState, AREA_STATE } from './states/area.state';
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
    provide:AREA_STATE,
    useFactory:()=>new RxState<AreaState>()
  }]
})
export class AreaModule { }
