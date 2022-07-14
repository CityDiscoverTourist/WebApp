import { InjectionToken } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { Customer, PagingMetadata } from 'src/app/models';

export interface CustomerListState {
  customers: Customer[];
  metadata: PagingMetadata;
  loading: boolean;
}
export const CUSTOMER_LIST_STATE = new InjectionToken<RxState<CustomerListState>>(
  'CUSTOMER_LIST_STATE'
);
