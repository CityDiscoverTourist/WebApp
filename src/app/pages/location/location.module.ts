import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationRoutingModule } from './location-routing.module';
import { LocationComponent } from './location.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

const lib = [NgxDatatableModule];


@NgModule({
  declarations: [
    LocationComponent
  ],
  imports: [
    CommonModule,
    LocationRoutingModule,
    ...lib
  ]
})
export class LocationModule { }
