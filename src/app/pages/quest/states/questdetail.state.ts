import { InjectionToken } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { Quest, QuestListItem } from 'src/app/models';

export interface QuestDetailState {
  // quest: Quest;
  quest: QuestListItem;
  loading: boolean;
}
export const QUEST_DETAIL_STATE = new InjectionToken<RxState<QuestDetailState>>(
  'QUEST_DETAIL_STATE'
);
