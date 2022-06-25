import { SearchInfo } from "./common.model";

export interface CustomerQuest {
  id: number;
  beginPoint: string;
  endPoint: string;
  createdDate: Date;
  rating: number;
  feedBack: string;
  customerId: string;
  isFinished: true;
  questId: number;
  status: string;
  // paymentMethod:{};
}

export interface CustomerQuestListItem {
  // id: number;
  //customerId:string;
  beginPoint: string;
  endPoint: string;
  createdDate: Date;
  rating: number;
  feedBack: string;
  customerId: string;
  isFinished: true;
  questId: number;
  status: string;
}

export interface CustomerQuestListSearch extends SearchInfo {
  isFinished?: number[];
}
