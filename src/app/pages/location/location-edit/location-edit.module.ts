import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationEditRoutingModule } from './location-edit-routing.module';
import { LocationEditComponent } from './location-edit.component';


@NgModule({
  declarations: [
    LocationEditComponent
  ],
  imports: [
    CommonModule,
    LocationEditRoutingModule
  ]
})
export class LocationEditModule { }
