import { InjectionToken } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { PagingMetadata, QuestItemListItem } from 'src/app/models';

export interface QuestItemListState {
  questitems: QuestItemListItem[];
  metadata: PagingMetadata;
  loading: boolean;
}
export const QUEST_ITEM_LIST_STATE = new InjectionToken<RxState<QuestItemListState>>(
  'QUEST_ITEM_LIST_STATE'
);
