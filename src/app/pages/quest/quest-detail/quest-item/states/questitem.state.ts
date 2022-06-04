import { InjectionToken } from "@angular/core";
import { RxState } from "@rx-angular/state";
import { IdValue } from "src/app/models";

export interface QuestItemState{
    questItemTypeIds:IdValue[],
    locationIds:IdValue[],
}

export const QUEST_ITEM_STATE=new InjectionToken<RxState<QuestItemState>>('QUEST_ITEM_STATE');