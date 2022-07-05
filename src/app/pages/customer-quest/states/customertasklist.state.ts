import { InjectionToken } from "@angular/core";
import { RxState } from "@rx-angular/state";
import { CustomerTaskListItem, PagingMetadata } from "src/app/models";

export interface CustomerTaskListState{
    customertasks:CustomerTaskListItem[],
    metadata:PagingMetadata,
    loading:boolean,
}
export const CUSTOMERTASKLIST_STATE=new InjectionToken<RxState<CustomerTaskListState>>("CUSTOMERTASKLIST_STATE");