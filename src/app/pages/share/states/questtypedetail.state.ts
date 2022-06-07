import { InjectionToken } from '@angular/core';
import { RxState } from '@rx-angular/state';
import {  QuestType } from 'src/app/models';

export interface QuestTypeDetailState {
  locationType: QuestType;
  loading: boolean;
}
export const QUEST_TYPE_DETAIL_STATE = new InjectionToken<RxState<QuestTypeDetailState>>(
  'QUEST_TYPE_DETAIL_STATE'
);
