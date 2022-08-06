import { SearchInfo } from "./common.model";

export interface QuestType{
  id:number;
  name:string;
  status:string;
  imagePath:string;
}

export interface QuestTypeCreate{
  id:number;
  name:string;
  status:string;
  image:File;
}

export interface QuestTypeListItem{
  index:number;
  id:number;
  name:string;
  createdDate:Date;
  status:string;
  imagePath:string;
  quests:[];
}

export interface QuestTypeListSearch extends SearchInfo {
  status?: number[];
  language?: string;
}

