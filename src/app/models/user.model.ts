export interface CurrentUser {
  email: string;
  fullName: string;
}

export interface UserToken {
  idProvider: string;
  jwtToken: string;
  email: string;
  accountId: string;
  fullName: string;
  imagePath: string;
  refreshToken: string;
  refreshTokenExpiryTime: string;
}
