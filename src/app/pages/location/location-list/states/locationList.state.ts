import { InjectionToken } from "@angular/core";
import { RxState } from "@rx-angular/state";
import { LocationListItem, PagingMetadata } from "src/app/models";

export interface LocationListState{
    locations:LocationListItem[],
    //can page nao,total bao nhieu nua can them metadata them vao common
    metadata:PagingMetadata,
}
export const LOCATION_STATE=new InjectionToken<RxState<LocationListState>>("LOCATION_STATE");