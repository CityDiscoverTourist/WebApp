import { SearchInfo } from "./common.model";

export interface Reward {
  name: string;
  code: string;
  receivedDate: Date;
  expiredDate: Date;
  percentDiscount: number;
  customerId: string;
  customerName:string;
  status: string;
}

export interface RewardListSearch extends SearchInfo{
  status?: number[];
}

