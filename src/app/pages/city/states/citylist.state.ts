import { InjectionToken } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { PagingMetadata, CityListItem } from 'src/app/models';

export interface CityListState {
  cities: CityListItem[];
  metadata: PagingMetadata;
  loading: boolean;
}
export const CITY_LIST_STATE = new InjectionToken<RxState<CityListState>>(
  'CITY_LIST_STATE'
);

