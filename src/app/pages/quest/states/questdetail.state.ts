import { InjectionToken } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { Quest } from 'src/app/models';

export interface QuestDetailState {
  quest: Quest;
  loading: boolean;
}
export const QUEST_DETAIL_STATE = new InjectionToken<RxState<QuestDetailState>>(
  'QUEST_DETAIL_STATE'
);
