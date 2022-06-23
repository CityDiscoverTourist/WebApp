import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AreaListRoutingModule } from './area-list-routing.module';
import { AreaListComponent } from './area-list.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HotToastModule } from '@ngneat/hot-toast';

const lib = [
  NgxDatatableModule,
  ModalModule.forRoot(),
  HotToastModule.forRoot(),
  NgSelectModule
];
@NgModule({
  declarations: [AreaListComponent],
  imports: [
    CommonModule,
    AreaListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ...lib,
  ],
})
export class AreaListModule {}
