import { InjectionToken } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { PagingMetadata, QuestTypeListItem } from 'src/app/models';

export interface QuestTypeListState {
  questtypes: QuestTypeListItem[];
  metadata: PagingMetadata;
  loading: boolean;
}
export const QUEST_TYPE_LIST_STATE = new InjectionToken<RxState<QuestTypeListState>>(
  'QUEST_TYPE_LIST_STATE'
);

