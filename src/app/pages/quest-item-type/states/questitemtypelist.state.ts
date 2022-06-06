import { InjectionToken } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { PagingMetadata, QuestItemTypeListItem } from 'src/app/models';

export interface QuestItemTypeListState {
  questitemtypes: QuestItemTypeListItem[];
  metadata: PagingMetadata;
  loading: boolean;
}
export const QUEST_ITEM_TYPE_LIST_STATE = new InjectionToken<RxState<QuestItemTypeListState>>(
  'QUEST_ITEM_TYPE_LIST_STATE'
);

