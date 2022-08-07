import { SearchInfo } from "./common.model";
import { Suggestion } from "./suggestion.model";

export interface QuestItem {
  id: number;
  content: string;
  description: string;
  story:string;
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
  // imageDescription:File[];
}

export interface QuestItemCreate{
  id: number;
  content: string;
  story:string;
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
  imageDescription:File[];
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
  story:string;
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
  imageDescription:string;
  suggestions:Suggestion[];
}

export interface QuestItemCreateResult{
  id:number;
}