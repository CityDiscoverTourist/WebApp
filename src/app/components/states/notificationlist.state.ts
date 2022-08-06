import { InjectionToken } from '@angular/core';
import { RxState } from '@rx-angular/state';
import {Notification,  PagingMetadata } from 'src/app/models';

export interface NotificationListState {
  notifications: Notification[];
  metadata: PagingMetadata;
  loading: boolean;
  notificationLength:number;
}
export const NOTIFICATION_LIST_STATE = new InjectionToken<
  RxState<NotificationListState>
>('NOTIFICATION_LIST_STATE');
