import { InjectionToken } from "@angular/core";
import { RxState } from "@rx-angular/state";
import { LocationListItem, PagingMetadata } from "src/app/models";

export interface AreaListState{
    locations:LocationListItem[],
    metadata:PagingMetadata,
}
export const AREA_STATE=new InjectionToken<RxState<AreaListState>>("AREA_STATE");