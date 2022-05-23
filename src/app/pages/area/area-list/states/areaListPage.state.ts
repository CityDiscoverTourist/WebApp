import { InjectionToken } from "@angular/core";
import { RxState } from "@rx-angular/state";
import { IdValue } from "src/app/models";

export interface AreaListPageState{
    cityIds:IdValue[]
}


export const AREA_PAGE_STATE=new InjectionToken<RxState<AreaListPageState>>("AREA_PAGE_STATE");