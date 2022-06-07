import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationTypeRoutingModule } from './location-type-routing.module';
import { LocationTypeComponent } from './location-type.component';


@NgModule({
  declarations: [
    LocationTypeComponent
  ],
  imports: [
    CommonModule,
    LocationTypeRoutingModule
  ]
})
export class LocationTypeModule { }
