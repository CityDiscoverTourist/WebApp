import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserToken } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}
  login(email: string, password: string): Observable<UserToken> {
    return this.httpClient.post<any>(
      `${environment.apiUrl}/api/v1/auths/login`,
      { email, password }
    );
  }
}
