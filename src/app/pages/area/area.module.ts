import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AreaRoutingModule } from './area-routing.module';
import { AreaComponent } from './area.component';
import { AreaListComponent } from './area-list/area-list.component';
import { AreaEditComponent } from './area-edit/area-edit.component';


@NgModule({
  declarations: [
    AreaComponent,
    AreaListComponent,
    AreaEditComponent
  ],
  imports: [
    CommonModule,
    AreaRoutingModule
  ]
})
export class AreaModule { }
