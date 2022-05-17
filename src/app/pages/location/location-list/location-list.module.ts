import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationListRoutingModule } from './location-list-routing.module';
import { LocationListComponent } from './location-list.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

const lib = [NgxDatatableModule];

@NgModule({
  declarations: [
    LocationListComponent
  ],
  imports: [
    CommonModule,
    LocationListRoutingModule,
    ...lib
  ]
})
export class LocationListModule { }
