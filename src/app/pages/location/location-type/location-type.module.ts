import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationTypeRoutingModule } from './location-type-routing.module';
import { LocationTypeComponent } from './location-type.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
const lib = [NgxDatatableModule];

@NgModule({
  declarations: [
    LocationTypeComponent
  ],
  imports: [
    CommonModule,
    LocationTypeRoutingModule,
    ...lib
  ]
})
export class LocationTypeModule { }
