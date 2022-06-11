import { InjectionToken } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { Location } from 'src/app/models';

export interface LocationDetailState {
  location: Location;
  loading: boolean;
}
export const LOCATION_DETAIL_STATE = new InjectionToken<
  RxState<LocationDetailState>
>('LOCATION_DETAIL_STATE');
