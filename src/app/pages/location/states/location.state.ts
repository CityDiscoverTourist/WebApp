import { InjectionToken } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { IdValue } from 'src/app/models';

export interface LocationState {
  locationTypeIds: IdValue[];
  areaIds: IdValue[];
}

export const LOCATION_STATE = new InjectionToken<RxState<LocationState>>(
  'LOCATION_STATE'
);
