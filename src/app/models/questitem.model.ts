import { SearchInfo } from "./common.model";
import { Suggestion } from "./suggestion.model";

export interface QuestItem {
  id: number;
  content: string;
  description: string;
  duration: number;
  createdDate: Date;
  updatedDate: Date;
  qrCode: string;
  triggerMode: number;
  rightAnswer: string;
  answerImageUrl: string;
  status: string;
  questItemTypeId: number;
  locationId: number;
  questId: number;
  itemId: number;
}

export interface QuestItemCreate{
  id: number;
  content: string;
  description: string;
  duration: number;
  createdDate: Date;
  updatedDate: Date;
  qrCode: string;
  triggerMode: number;
  rightAnswer: string;
  answerImageUrl: string;
  status: string;
  questItemTypeId: number;
  locationId: number;
  questId: number;
  itemId: number;
  image:File[];
  listImages:[];

}

export interface QuestItemListSearch extends SearchInfo {
  questItemTypeIds?: number[];
  questId?:number;
}

export interface QuestItemListItem {
  index: number;
  id: number;
  content: string;
  description: string;
  duration: number;
  createdDate: Date;
  updatedDate: Date;
  qrCode: string;
  triggerMode: number;
  rightAnswer: string;
  answerImageUrl: string;
  status: string;
  questItemTypeId: number;
  locationId: number;
  questId: number;
  itemId: number;
  listImages:[];
  suggestions:Suggestion[];
}

export interface QuestItemCreateResult{
  id:number;
}