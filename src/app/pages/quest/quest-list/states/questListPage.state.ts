import { InjectionToken } from "@angular/core";
import { RxState } from "@rx-angular/state";
import { IdValue } from "src/app/models";

export interface QuestListPageState{
    categories:IdValue[];
}

export const QUEST_PAGE_STATE = new InjectionToken<RxState<QuestListPageState>>('QUEST_PAGE_STATE');