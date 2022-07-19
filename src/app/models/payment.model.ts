import { SearchInfo } from "./common.model";

export interface Payment {
  id: string;
  paymentMethod: string;
  quantity:number;
  totalAmount: number;
  status: string;
  createdDate: Date;
  customerId: string;
  isValid: boolean;
  questId: number;
  questName: string;
  questDescription: string;
}

export interface PaymentListSearch extends SearchInfo {
  status?: boolean;
}
