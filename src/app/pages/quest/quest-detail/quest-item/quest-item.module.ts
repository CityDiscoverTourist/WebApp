import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestItemRoutingModule } from './quest-item-routing.module';
import { QuestItemComponent } from './quest-item.component';
import { QuestItemState, QUEST_ITEM_STATE } from './states/';
import { RxState } from '@rx-angular/state';


@NgModule({
  declarations: [
    QuestItemComponent
  ],
  imports: [
    CommonModule,
    QuestItemRoutingModule,
    
  ],
  // providers:[{
  //   provide:QUEST_ITEM_STATE,
  //   useFactory:()=>new RxState<QuestItemState>()
  // }]
})
export class QuestItemModule { }
