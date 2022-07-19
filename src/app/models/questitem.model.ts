import { SearchInfo } from "./common.model";

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
  image:File[]
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
}

export interface QuestItemCreateResult{
  id:number;
}