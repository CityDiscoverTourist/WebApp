import { InjectionToken } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { City } from 'src/app/models';

export interface CityDetailState {
  city: City;
  loading: boolean;
}
export const CITY_DETAIL_STATE = new InjectionToken<RxState<CityDetailState>>(
  'CITY_DETAIL_STATE'
);
