import { SearchInfo } from "./common.model";

export interface Quest {
  id: number;
  title: string;
  description: string;
  price: number;
  estimatedTime: string;
  estimatedDistance: string;
  availableTime: Date;
  createdDate: Date;
  updatedDate: Date;
}


export interface QuestListItem {
  id: number;
  title: string;
  description: string;
  price: number;
  estimatedTime: string;
  estimatedDistance: string;
  availableTime: Date;
  createdDate: Date;
  updatedDate: Date;
  status:string;
  questTypeId: number;
  questOwnerId: number;
  areaId: number;
}


export interface QuestListSearch extends SearchInfo {
  categories?: number[];
}

export interface QuestData {
  id: number;
  title: string;
  description: string;
  price: number;
  image:File;
  // image:string;
  estimatedTime: string;
  estimatedDistance: string;
  availableTime: Date;
  createdDate: Date;
  updatedDate: Date;
  status:string;
  questTypeId: number;
  questOwnerId: number;
  areaId: number;
}

export interface QuestCreateResult{
  id:number;
}

