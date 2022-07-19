import { InjectionToken } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { Customer, PagingMetadata, Payment } from 'src/app/models';

export interface PaymentListState {
  payments: Payment[];
  metadata: PagingMetadata;
  loading: boolean;
}
export const PAYMENT_LIST_STATE = new InjectionToken<RxState<PaymentListState>>(
  'PAYMENT_LIST_STATE'
);
