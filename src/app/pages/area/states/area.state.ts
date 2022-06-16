import { InjectionToken } from "@angular/core";
import { RxState } from "@rx-angular/state";
import { IdValue } from "src/app/models";

export interface AreaState{
    cityIds:IdValue[]
}


export const AREA_STATE=new InjectionToken<RxState<AreaState>>("AREA_STATE");