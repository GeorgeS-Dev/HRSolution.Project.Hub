import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { HttpService } from './http.service';
import { SignInResponse } from '../identity/models/sign-in.response.model';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly ACCESS_TOKEN_EXPIRES_KEY = 'accessTokenExpires';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly REFRESH_TOKEN_EXPIRES_KEY = 'refreshTokenExpires';

  constructor(private httpService: HttpService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Needs fixing
    // const now = new Date();
    // const refreshTokenExpiry = new Date(localStorage.getItem(this.REFRESH_TOKEN_EXPIRES_KEY) || '');
    // const accessTokenExpiry = new Date(localStorage.getItem(this.ACCESS_TOKEN_EXPIRES_KEY) || '');

    // if (now >= refreshTokenExpiry) {
    //   this.handleAuthError();
    //   return throwError(() => new Error('Token has expired. Logging out.'));
    // }

    // if (now >= accessTokenExpiry) {
    //   const refreshToken = this.getRefreshToken();
    //   if (refreshToken) {
    //     return this.refreshAccessToken(refreshToken, request, next);
    //   } else {
    //     this.handleAuthError();
    //     return throwError(() => new Error('Token has expired and no refresh token available. Logging out.'));
    //   }
    // }

    let authReq = this.addTokenHeader(request);

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error, request, next))
    );
  }

  private handleError(error: HttpErrorResponse, request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (error.status === 401) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        const refreshToken = this.getRefreshToken();
        if (refreshToken) {
          return this.refreshAccessToken(refreshToken, request, next);
        } else {
          this.handleAuthError();
        }
      } else {
        return this.waitForTokenRefresh(request, next);
      }
    }
    return throwError(() => error);
  }

  private refreshAccessToken(refreshToken: string, request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.httpService.refreshToken(refreshToken).pipe(
      switchMap((data: SignInResponse) => {
        this.setToken(data.accessToken, data.accessTokenExpires, data.refreshToken, data.refreshTokenExpires);
        this.refreshTokenSubject.next(data.accessToken);
        this.isRefreshing = false;
        return next.handle(this.addTokenHeader(request));
      }),
      catchError(() => {
        this.isRefreshing = false;
        this.handleAuthError();
        return new Observable<HttpEvent<any>>();
      })
    );
  }

  private waitForTokenRefresh(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.refreshTokenSubject.pipe(
      filter(token => token != null),
      take(1),
      switchMap(() => next.handle(this.addTokenHeader(request)))
    );
  }

  private handleAuthError(): void {
    this.removeToken();
    this.router.navigate(['/auth/sign-in']);
  }

  private getToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  private setToken(accessToken: string = "", accessTokenExpires: Date = new Date, refreshToken: string = "", refreshTokenExpires: Date = new Date): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.ACCESS_TOKEN_EXPIRES_KEY, accessTokenExpires.toString());
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(this.REFRESH_TOKEN_EXPIRES_KEY, refreshTokenExpires.toString());
  }

  private removeToken(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  private addTokenHeader(request: HttpRequest<any>): HttpRequest<any> {
    const token = this.getToken();
    if (token) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return request;
  }
}