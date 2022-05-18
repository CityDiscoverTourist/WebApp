import { InjectionToken } from "@angular/core";
import { RxState } from "@rx-angular/state";

export interface LocationListState{
    
}

export const LOCATION_STATE=new InjectionToken<RxState<LocationListState>>("LOCATION_STATE");