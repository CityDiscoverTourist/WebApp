import { InjectionToken } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { QuestItem } from 'src/app/models';

export interface QuestItemDetailState {
  questItem: QuestItem;
  loading: boolean;
}
export const QUEST_ITEM_DETAIL_STATE = new InjectionToken<
  RxState<QuestItemDetailState>
>('QUEST_ITEM_DETAIL_STATE');
