import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreaRoutingModule } from './area-routing.module';
import { AreaComponent } from './area.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
const lib = [NgxDatatableModule];
@NgModule({
  declarations: [
    AreaComponent,
  ],
  imports: [
    CommonModule,
    AreaRoutingModule,
    ...lib,
  ]
})
export class AreaModule { }
