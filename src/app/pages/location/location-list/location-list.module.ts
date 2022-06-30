import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationListRoutingModule } from './location-list-routing.module';
import { LocationListComponent } from './location-list.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HotToastModule } from '@ngneat/hot-toast';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

const lib = [
  NgSelectModule,
  NgxDatatableModule,
  ModalModule.forRoot(),
  HotToastModule.forRoot(),
  TooltipModule.forRoot(),
];

@NgModule({
  declarations: [LocationListComponent],
  imports: [
    CommonModule,
    LocationListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ...lib,
  ],
})
export class LocationListModule {}
