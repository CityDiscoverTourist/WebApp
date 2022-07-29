import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommemtListRoutingModule } from './commemt-list-routing.module';
import { CommemtListComponent } from './commemt-list.component';


@NgModule({
  declarations: [
    CommemtListComponent
  ],
  imports: [
    CommonModule,
    CommemtListRoutingModule
  ]
})
export class CommemtListModule { }
