import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestTypeCreateRoutingModule } from './quest-type-create-routing.module';
import { QuestTypeCreateComponent } from './quest-type-create.component';


@NgModule({
  declarations: [
    QuestTypeCreateComponent
  ],
  imports: [
    CommonModule,
    QuestTypeCreateRoutingModule
  ]
})
export class QuestTypeCreateModule { }
