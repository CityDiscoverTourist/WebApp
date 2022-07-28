import { Customer } from './customer.model';

export interface Notification {
  id: number;
  content: string;
  createdDate: Date;
  questId: number;
  paymentId: string;
  notifyUsers: Customer;
}
