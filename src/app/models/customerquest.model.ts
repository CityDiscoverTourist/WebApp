import { SearchInfo } from "./common.model";

export interface CustomerQuest {
  id: number;
  beginPoint: string;
  endPoint: string;
  createdDate: Date;
  rating: number;
  feedBack: string;
  customerId: string;
  customerName:string;
  isFinished: boolean;
  questId: number;
  paymentId:string;
  status: string;

}

export interface CustomerQuestListItem {
  id: number;
  beginPoint: string;
  endPoint: string;
  createdDate: Date;
  rating: number;
  feedBack: string;
  customerId: string;
  customerName:string;
  isFinished: boolean;
  questId: number;
  paymentId:string;
  status: string;
}

export interface CustomerQuestListSearch extends SearchInfo {
  isFinished?: number[];
}
