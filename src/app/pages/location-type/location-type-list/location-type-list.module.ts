import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationTypeListRoutingModule } from './location-type-list-routing.module';
import { LocationTypeListComponent } from './location-type-list.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HotToastModule } from '@ngneat/hot-toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

const lib = [
  NgxDatatableModule,
  ModalModule.forRoot(),
  HotToastModule.forRoot(),
  NgSelectModule,
  TooltipModule.forRoot(),
];
@NgModule({
  declarations: [LocationTypeListComponent],
  imports: [
    CommonModule,
    LocationTypeListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ...lib,
  ],
})
export class LocationTypeListModule {}
