import { InjectionToken } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { QuestItemType } from 'src/app/models';

export interface QuestItemTypeDetailState {
  city: QuestItemType;
  loading: boolean;
}
export const QUEST_ITEM_TYPE_DETAIL_STATE = new InjectionToken<RxState<QuestItemTypeDetailState>>(
  'QUEST_ITEM_TYPE_DETAIL_STATE'
);
