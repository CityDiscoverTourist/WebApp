import { InjectionToken } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { Area } from 'src/app/models';

export interface AreaDetailState {
  area: Area;
  loading: boolean;
}
export const AREA_DETAIL_STATE = new InjectionToken<RxState<AreaDetailState>>(
  'AREA_DETAIL_STATE'
);
