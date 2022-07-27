import { SearchInfo } from './common.model';
export interface Customer {
  id: string;
  userName: string;
  normalizedUserName: string;
  email: string;
  normalizedEmail: string;
  emailConfirmed: boolean;
  passwordHash: string;
  securityStamp: string;
  concurrencyStamp: string;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: Date;
  lockoutEnabled: boolean;
  accessFailedCount: number;
  imagePath: string;
  gender: boolean;
  address: string;
  fullName: string;
}

export interface CustomerListSearch extends SearchInfo {
  isLock?: boolean;
}
