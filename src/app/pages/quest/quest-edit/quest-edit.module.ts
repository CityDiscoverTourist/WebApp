import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestEditRoutingModule } from './quest-edit-routing.module';
import { QuestEditComponent } from './quest-edit.component';


@NgModule({
  declarations: [
    QuestEditComponent
  ],
  imports: [
    CommonModule,
    QuestEditRoutingModule
  ]
})
export class QuestEditModule { }
