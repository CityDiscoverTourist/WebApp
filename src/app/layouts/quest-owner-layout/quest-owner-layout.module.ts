import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestOwnerLayoutRoutingModule } from './quest-owner-layout-routing.module';
import { QuestOwnerLayoutComponent } from './quest-owner-layout.component';


@NgModule({
  declarations: [
    QuestOwnerLayoutComponent
  ],
  imports: [
    CommonModule,
    QuestOwnerLayoutRoutingModule
  ]
})
export class QuestOwnerLayoutModule { }
