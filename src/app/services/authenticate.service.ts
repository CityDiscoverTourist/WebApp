import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  concat,
  filter,
  map,
  Observable,
  of,
  tap,
  take,
} from 'rxjs';
import { CurrentUser, UserToken } from '../models';
import { StorageService } from './storage.service';
import jwt_decode from 'jwt-decode';

declare type Claim = {
  key: string;
  value: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthenticateService {
  constructor(private storage: StorageService) {}

  getToken(): Observable<string> {
    return of(this.storage.get('token') || '');
  }

  clearToken(): void {
    this.storage.set('token', null);
  }

  persistToken(token: string) {
    this.storage.set('token', token);
  }

  private user$ = new BehaviorSubject<CurrentUser | null>(null);

  isAuthenticated(): Observable<boolean> {
    return this.getUser().pipe(map((u) => !!u));
  }
  getUser(): Observable<CurrentUser | null> {
    return concat(
      this.user$.pipe(
        take(1),
        filter((u) => !!u)
      ),
      this.getCurrentUser().pipe(
        filter((u) => !!u),
        tap((u) => this.user$.next(u))
      ),
      this.user$.asObservable()
    );
  }
  getCurrentUser(): Observable<CurrentUser | null> {
    const token = this.storage.get('token');
    if (!token) {
      return of(null);
    }
    let claims: any;
    try {
      //decode token
      claims = jwt_decode(token);
    } catch (error) {
      return of(null);
    }

    //check expiry
    if (!claims || Date.now().valueOf() > claims.exp * 1000) {
      return of(null);
    }
  
    const user: CurrentUser = {
      fullName: claims[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
      ] as string,
      email: claims[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
      ] as string,
    };
    return of(user);
  }
}
