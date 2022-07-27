import { InjectionToken } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { PagingMetadata, Reward } from 'src/app/models';

export interface RewardListState {
  cities: Reward[];
  metadata: PagingMetadata;
  loading: boolean;
}
export const REWARD_LIST_STATE = new InjectionToken<RxState<RewardListState>>(
  'REWARD_LIST_STATE'
);
