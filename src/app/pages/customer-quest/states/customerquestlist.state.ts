import { InjectionToken } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { CustomerQuestListItem, PagingMetadata } from 'src/app/models';

export interface CustomerQuestListState {
  customerquests: CustomerQuestListItem[];
  metadata: PagingMetadata;
  loading: boolean;
}
export const CUSTOMER_QUEST_LIST_STATE = new InjectionToken<
  RxState<CustomerQuestListState>
>('CUSTOMER_QUEST_LIST_STATE');
