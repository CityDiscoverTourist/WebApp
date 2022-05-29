import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestRoutingModule } from './quest-routing.module';
import { QuestComponent } from './quest.component';
import { RxState } from '@rx-angular/state';
import { QuestState, QUEST_STATE } from './states/quest.state';



@NgModule({
  declarations: [
    QuestComponent
  ],
  imports: [
    CommonModule,
    QuestRoutingModule,
  ],
  providers:[{
    provide:QUEST_STATE,
    useFactory:()=>new RxState<QuestState>()
  }]

})
export class QuestModule { }
