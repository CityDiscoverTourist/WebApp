import { InjectionToken } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { LocationType } from 'src/app/models';

export interface LocationTypeDetailState {
  locationType: LocationType;
  loading: boolean;
}
export const LOCATION_TYPE_DETAIL_STATE = new InjectionToken<RxState<LocationTypeDetailState>>(
  'LOCATION_TYPE_DETAIL_STATE'
);
