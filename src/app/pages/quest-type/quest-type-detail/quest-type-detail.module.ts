import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestTypeDetailRoutingModule } from './quest-type-detail-routing.module';
import { QuestTypeDetailComponent } from './quest-type-detail.component';


@NgModule({
  declarations: [
    QuestTypeDetailComponent
  ],
  imports: [
    CommonModule,
    QuestTypeDetailRoutingModule
  ]
})
export class QuestTypeDetailModule { }
