import { SearchInfo } from './common.model';

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
  status: string;
  questTypeId: number;
  questOwnerId: number;
  areaId: number;
  imagePath: string;
}

export interface QuestListItem {
  index: number;
  id: number;
  title: string;
  description: string;
  price: number;
  estimatedTime: string;
  estimatedDistance: string;
  availableTime: Date;
  createdDate: Date;
  updatedDate: Date;
  status: string;
  questTypeId: number;
  questOwnerId: number;
  areaId: number;
  imagePath: string;
}

export interface QuestListSearch extends SearchInfo {
  questTypeIds?: number[];
  language?: string;
}

export interface QuestCreate {
  id: number;
  title: string;
  description: string;
  price: number;
  estimatedTime: string;
  estimatedDistance: string;
  image: File;
  availableTime: string;
  createdDate: Date;
  updatedDate: Date;
  status: string;
  questTypeId: number;
  questOwnerId: number;
  areaId: number;
}

export interface QuestCreateResult {
  id: number;
}
