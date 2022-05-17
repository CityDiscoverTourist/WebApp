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

export interface QuestCreate {
  id: number;
  title: string;
  description: string;
  price: number;
  estimatedTime: string;
  estimatedDistance: string;
  availableTime: Date;
  createdDate: Date;
  updatedDate: Date;
  questTypeId: number;
  areaId: number;
  questOwnerId: number;
  questItems: [];
  competitions: [];
  qwnerPayments: [];
  rewards: [];
}

export interface QuestListItem {
  id: number;
  title: string;
  description: string;
  price: number;
  estimatedTime: string;
  estimatedDistance: string;
}

export interface QuestListSearch {
  categories?: number[];
}

export interface QuestCreateResult{
  id: number,
}

