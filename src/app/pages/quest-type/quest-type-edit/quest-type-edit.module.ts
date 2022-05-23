import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestTypeEditRoutingModule } from './quest-type-edit-routing.module';
import { QuestTypeEditComponent } from './quest-type-edit.component';


@NgModule({
  declarations: [
    QuestTypeEditComponent
  ],
  imports: [
    CommonModule,
    QuestTypeEditRoutingModule
  ]
})
export class QuestTypeEditModule { }
