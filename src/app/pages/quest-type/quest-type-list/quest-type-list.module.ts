import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestTypeListRoutingModule } from './quest-type-list-routing.module';
import { QuestTypeListComponent } from './quest-type-list.component';


@NgModule({
  declarations: [
    QuestTypeListComponent
  ],
  imports: [
    CommonModule,
    QuestTypeListRoutingModule
  ]
})
export class QuestTypeListModule { }
