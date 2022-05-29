import { InjectionToken } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { PagingMetadata, QuestListItem } from 'src/app/models';

export interface QuestListState {
  quests: QuestListItem[];
  metadata: PagingMetadata;
  loading: boolean;
}
export const QUEST_LIST_STATE = new InjectionToken<RxState<QuestListState>>(
  'QUEST_LIST_STATE'
);
