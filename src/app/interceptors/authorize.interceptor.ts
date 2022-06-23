import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { catchError, Observable, throwError, mergeMap } from 'rxjs';
import { AuthenticateService } from '../services';
import { Router } from '@angular/router';

@Injectable()
export class AuthorizeInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthenticateService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.authService
      .getToken()
      .pipe(
        mergeMap((token) => this.processRequestWithToken(token, request, next))
      );
  }

  private processRequestWithToken(
    token: string | null,
    req: HttpRequest<any>,
    next: HttpHandler
  ) {
    req = req.clone({
      url: req.url,
    });
    if (!!token && token?.length > 0) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(req).pipe(catchError(this.handleError));
  }

  private handleError = (err: any) => {
    if (err.status === 401) {
      this.router.navigate(['login']);
      this.authService.clearToken();
    }
    return throwError({
      success: false,
      statusCode: 'internal server error',
    });
  };
  private isSameOrigin(req: any): boolean {
    if (req.url.startsWith(`${window.location.origin}/`)) {
      return true;
    }
    if (req.url.startsWith(`//${window.location.host}/`)) {
      return true;
    }
    if (/^\^\/].*/.test(req.url)) {
      return true;
    }
    return false;
  }
}
