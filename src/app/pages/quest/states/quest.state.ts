import { InjectionToken } from "@angular/core";
import { RxState } from "@rx-angular/state";
import { IdValue } from "src/app/models";

export interface QuestState{
    questTypeIds:IdValue[],
    areaIds:IdValue[],
}


export const QUEST_STATE=new InjectionToken<RxState<QuestState>>("QUEST_STATE");