import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { UserToken } from '../models';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  private _sharedHeaders = new HttpHeaders();
  constructor(private httpClient: HttpClient) {
    super();
  }
  

  login(email: string, password: string): Observable<UserToken> {
    return this.httpClient.post<any>(
      `${environment.apiUrl}/api/v1/auths/login-admin`,
      {email,password},
      { headers: this._sharedHeaders }
    );
  }

  forgetPassword(email: string) {
    return this.httpClient.post<any>(
      `${environment.apiUrl}/api/v1/auths/forgot-password?email=${email}`,
      { headers: this._sharedHeaders }
    );
  }

  addAdminAccount(role:string,email: string, password: string):Observable<boolean>{
    return this.httpClient.post<boolean>(
      `${environment.apiUrl}/api/v1/auths/register-admin?role=${role}`,
      {email,password},
      { headers: this._sharedHeaders }
    );
  }
}
