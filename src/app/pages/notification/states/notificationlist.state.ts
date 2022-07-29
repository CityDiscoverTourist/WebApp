import { InjectionToken } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { PagingMetadata, Notification } from 'src/app/models';

export interface NotificationListState {
  notifications: Notification[];
  metadata: PagingMetadata;
  loading: boolean;
}
export const NOTIFICATION_LIST_STATE = new InjectionToken<RxState<NotificationListState>>(
  'NOTIFICATION_LIST_STATE'
);

