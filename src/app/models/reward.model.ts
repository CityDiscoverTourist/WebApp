export interface Reward {
  name: string;
  code: string;
  receivedDate: Date;
  expiredDate: Date;
  percentDiscount: number;
  customerId: string;
  status: string;
}
