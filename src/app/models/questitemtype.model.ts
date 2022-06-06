export interface QuestItemType{
    id:number;
    name:string;
    status:string;
}

export interface QuestItemTypeCreate{
    id:number;
    name:string;
    status:string;
}

export interface QuestItemTypeListItem{
    index:number;
    id:number;
    name:string;
    status:string;
}


export interface QuestItemTypeCreateResult{
    id:number;
    name?:string;
}