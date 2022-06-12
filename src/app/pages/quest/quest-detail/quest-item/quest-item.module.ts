import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestItemRoutingModule } from './quest-item-routing.module';
import { QuestItemComponent } from './quest-item.component';


@NgModule({
  declarations: [
    QuestItemComponent
  ],
  imports: [
    CommonModule,
    QuestItemRoutingModule,
    
  ],
})
export class QuestItemModule { }
