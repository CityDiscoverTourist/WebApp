import { InjectionToken } from "@angular/core";
import { RxState } from "@rx-angular/state";
import { AreaListItem, PagingMetadata } from "src/app/models";

export interface AreaListState{
    areas:AreaListItem[],
    metadata:PagingMetadata,
}
export const AREA_STATE=new InjectionToken<RxState<AreaListState>>("AREA_STATE");