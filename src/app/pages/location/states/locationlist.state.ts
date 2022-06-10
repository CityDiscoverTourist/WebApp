import { InjectionToken } from "@angular/core";
import { RxState } from "@rx-angular/state";
import { LocationListItem, PagingMetadata } from "src/app/models";

export interface LocationListState{
    locations:LocationListItem[],
    metadata:PagingMetadata,
    loading:boolean,
}
export const LOCATION_STATE=new InjectionToken<RxState<LocationListState>>("LOCATION_STATE");