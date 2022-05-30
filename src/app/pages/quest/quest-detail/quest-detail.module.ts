import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestDetailRoutingModule } from './quest-detail-routing.module';
import { QuestDetailComponent } from './quest-detail.component';


@NgModule({
  declarations: [
    QuestDetailComponent
  ],
  imports: [
    CommonModule,
    QuestDetailRoutingModule
  ]
})
export class QuestDetailModule { }
