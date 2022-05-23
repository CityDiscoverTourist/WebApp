import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestRoutingModule } from './quest-routing.module';
import { QuestComponent } from './quest.component';
import { QuestListPageState, QUEST_PAGE_STATE } from './quest-list/states';
import { RxState } from '@rx-angular/state';



@NgModule({
  declarations: [
    QuestComponent
  ],
  imports: [
    CommonModule,
    QuestRoutingModule,
  ],
  providers:[{
    provide:QUEST_PAGE_STATE,
    useFactory:()=>new RxState<QuestListPageState>()
  }]

})
export class QuestModule { }
