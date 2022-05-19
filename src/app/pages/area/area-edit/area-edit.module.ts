import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AreaEditRoutingModule } from './area-edit-routing.module';
import { AreaEditComponent } from './area-edit.component';


@NgModule({
  declarations: [
    AreaEditComponent
  ],
  imports: [
    CommonModule,
    AreaEditRoutingModule
  ]
})
export class AreaEditModule { }
