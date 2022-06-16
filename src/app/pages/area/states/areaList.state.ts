import { InjectionToken } from "@angular/core";
import { RxState } from "@rx-angular/state";
import { AreaListItem, PagingMetadata } from "src/app/models";

export interface AreaListState{
    areas:AreaListItem[],
    metadata:PagingMetadata,
    loading:boolean;
}
export const AREA_LIST_STATE=new InjectionToken<RxState<AreaListState>>("AREA_LIST_STATE");