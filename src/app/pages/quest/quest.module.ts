import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestRoutingModule } from './quest-routing.module';
import { QuestComponent } from './quest.component';
import { RxState } from '@rx-angular/state';
import { QuestState, QUEST_STATE } from './states/quest.state';
import { AreaState, AREA_STATE } from '../area/states/area.state';

@NgModule({
  declarations: [QuestComponent],
  imports: [CommonModule, QuestRoutingModule],
  providers: [
    {
      provide: QUEST_STATE,
      useFactory: () => new RxState<QuestState>(),
    },
    {
      provide:AREA_STATE,
      useFactory:()=>new RxState<AreaState>()
    }
  ],
})
export class QuestModule {}
