import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AreaListRoutingModule } from './area-list-routing.module';
import { AreaListComponent } from './area-list.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';

const lib = [NgSelectModule, NgxDatatableModule];
@NgModule({
  declarations: [
    AreaListComponent
  ],
  imports: [
    CommonModule,
    AreaListRoutingModule,
    ...lib
  ]
})
export class AreaListModule { }
