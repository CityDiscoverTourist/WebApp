import { SearchInfo } from './common.model';

export interface QuestItemType {
  id: number;
  name: string;
  status: string;
}

export interface QuestItemTypeCreate {
  id: number;
  name: string;
  status: string;
}

export interface QuestItemTypeListItem {
  index: number;
  id: number;
  name: string;
  status: string;
  createdDate:Date;
  questItems: [];
}

export interface QuestItemTypeListSearch extends SearchInfo {
  status?: number[];
}
