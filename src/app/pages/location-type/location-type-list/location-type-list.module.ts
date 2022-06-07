import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationTypeListRoutingModule } from './location-type-list-routing.module';
import { LocationTypeListComponent } from './location-type-list.component';


@NgModule({
  declarations: [
    LocationTypeListComponent
  ],
  imports: [
    CommonModule,
    LocationTypeListRoutingModule
  ]
})
export class LocationTypeListModule { }
