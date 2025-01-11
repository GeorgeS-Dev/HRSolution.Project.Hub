import { Injectable } from '@angular/core';
import { jwtTokenClaims } from '../models/token-claims.model';
import { jwtDecode } from 'jwt-decode';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TokenService {
    private readonly ACCESS_TOKEN_KEY = 'accessToken';
    private readonly ACCESS_TOKEN_EXPIRES_KEY = 'accessTokenExpires';
    private readonly REFRESH_TOKEN_KEY = 'refreshToken';
    private readonly REFRESH_TOKEN_EXPIRES_KEY = 'refreshTokenExpires';
    private decodedJWT: jwtTokenClaims | null = null;
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private http: HttpClient, private router: Router) {
        const token = this.getToken();
        if (token) {
            this.decodeToken(token);
        }
    }

    setToken(accessToken: string = "", accessTokenExpires: Date = new Date(), refreshToken: string = "", refreshTokenExpires: Date = new Date()): void {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(this.ACCESS_TOKEN_EXPIRES_KEY, accessTokenExpires.toString());
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
        localStorage.setItem(this.REFRESH_TOKEN_EXPIRES_KEY, refreshTokenExpires.toString());
        this.decodeToken(accessToken);
    }

    getToken(): string | null {
        return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    removeToken(): void {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
        localStorage.removeItem(this.ACCESS_TOKEN_EXPIRES_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_EXPIRES_KEY);
        this.decodedJWT = null;
    }

    private decodeToken(token: string): void {
        try {
            this.decodedJWT = jwtDecode<jwtTokenClaims>(token);
        } catch (error) {
            console.error('Error decoding token', error);
            this.decodedJWT = null;
        }
    }

    getDecodedToken(): jwtTokenClaims | null {
        return this.decodedJWT;
    }

    getFirstName(): string {
        return this.decodedJWT?.FirstName ?? '';
    }

    getId(): string {
        return this.decodedJWT?.UserID ?? '';
    }

    getRole(): string {
        return this.decodedJWT?.role ?? '';
    }

    refreshToken() {
        const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
        return this.http.post<any>('/api/refresh-token', { refreshToken }).pipe(
            switchMap((data) => {
                this.setToken(data.accessToken, data.accessTokenExpires, data.refreshToken, data.refreshTokenExpires);
                this.refreshTokenSubject.next(data.accessToken);
                return this.refreshTokenSubject.asObservable();
            }),
            catchError((error: HttpErrorResponse) => {
                this.removeToken();
                this.router.navigate(['/sign-in']);
                return throwError(error);
            })
        );
      }
}