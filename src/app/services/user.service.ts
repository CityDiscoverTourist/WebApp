import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserToken } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}
  login(email: string, password: string): Observable<UserToken> {
    return this.httpClient.post<any>(
      `https://citytourist.azurewebsites.net/api/v1/auths/login-admin`,
      { email, password }
    );
  }
}
