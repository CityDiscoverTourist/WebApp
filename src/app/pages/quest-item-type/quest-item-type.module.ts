import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestItemTypeRoutingModule } from './quest-item-type-routing.module';
import { QuestItemTypeComponent } from './quest-item-type.component';


@NgModule({
  declarations: [
    QuestItemTypeComponent
  ],
  imports: [
    CommonModule,
    QuestItemTypeRoutingModule
  ]
})
export class QuestItemTypeModule { }
