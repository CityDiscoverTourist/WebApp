import { SearchInfo } from "./common.model";

export interface Payment {
  id: string;
  paymentMethod: string;
  quantity:number;
  totalAmount: number;
  status: string;
  createdDate: Date;
  customerId: string;
  customerEmail:string
  isValid: boolean;
  questId: number;
  questName: string;
  questDescription: string;
}

export interface PaymentExcel {
  id: string;
    questName: string;
    customerEmail: string;
    quantity: number;
    status: string;
    createdDate: Date,
    paymentMethod: string,
    totalAmount: number,
}

export interface PaymentListSearch extends SearchInfo {
  status?: boolean;
}
