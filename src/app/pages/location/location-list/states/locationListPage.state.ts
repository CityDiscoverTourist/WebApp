import { InjectionToken } from "@angular/core";
import { RxState } from "@rx-angular/state";
import { IdValue } from "src/app/models";

export interface LocationListPageState{
    locationtypes:IdValue[]
}

export const LOCATION_PAGE_STATE=new InjectionToken<RxState<LocationListPageState>>("LOCATION_PAGE_STATE");