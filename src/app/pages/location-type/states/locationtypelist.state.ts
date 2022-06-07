import { InjectionToken } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { LocationTypeListItem, PagingMetadata } from 'src/app/models';

export interface LocationTypeListState {
  locationtypes: LocationTypeListItem[];
  metadata: PagingMetadata;
  loading: boolean;
}
export const LOCATION_TYPE_LIST_STATE = new InjectionToken<RxState<LocationTypeListState>>(
  'LOCATION_TYPE_LIST_STATE'
);

