import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignInResponse } from '../models/sign-in.response.model';
import { AuthService } from './auth.service';
import { environment } from '../../../../../environments/environment';
import { HttpService } from '../../http/http.service';
import { SignUpRequest } from '../models/sign-up.request.model';

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  private readonly apiUrl = environment.identityServiceApiUrl;

  constructor(private http: HttpClient,
    private authService: AuthService,
    private httpService: HttpService
  ) {
  }

  signIn(request: any): Observable<SignInResponse> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    return this.httpService.httpPost<SignInResponse>(`${this.apiUrl}Account/SignIn`, request, headers);
  }

  signUp(request: SignUpRequest): Observable<any> { 
    const headers = new HttpHeaders()
      .set('Accept', 'text/plain')
      .set('Content-Type', 'application/json');
    return this.httpService.httpPost<any>(`${this.apiUrl}Profile/SignUp`, request, headers);
  }

  confirmTwoFactorSignIn(email: string, password: string, code: string, type: number = 0): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    const body = {
      email: email,
      password: password,
      type: type,
      code: String(code)
    };
    return this.httpService.httpPost<string>(`${this.apiUrl}Account/TwoFactorConfirm`, body, headers);
  }

  twoFactorEnableSend(): Observable<string> {
    const headers = new HttpHeaders()
      .set('Accept', 'text/plain')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this.authService.getAccessToken()}`);
    const body = { type: 0 };
    return this.httpService.httpPost<string>(`${this.apiUrl}Profile/TwoFactorEnableSend`, body, headers);
  }

  twoFactorEnableConfirm(code: string, type: number = 0): Observable<string> {
    const headers = new HttpHeaders()
      .set('Accept', 'text/plain')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this.authService.getAccessToken()}`);
    const body = {
      code: code,
      type: 0,
    };
    return this.httpService.httpPost<string>(`${this.apiUrl}Profile/TwoFactorEnableConfirm`, body, headers);
  }

  disableTwoFactor(): Observable<any> { 
    const headers = new HttpHeaders()
      .set('Accept', 'text/plain')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this.authService.getAccessToken()}`);
    return this.httpService.httpPost<any>(`${this.apiUrl}Profile/TwoFactorDisable`, {}, headers);
  }

  refreshToken(refreshToken: string): Observable<SignInResponse> {
    const headers = new HttpHeaders({
        Accept: 'text/plain',
        'Content-Type': 'application/json',
    });
    const body = { refreshToken };
    return this.httpService.httpPost<SignInResponse>(`${this.apiUrl}Account/RefreshToken`, body, headers);
  }

  changePassword(currentPassword: string, password: string, confirmPassword: string): Observable<any> {
    const body = {
      currentPassword: currentPassword,
      password: password,
      confirmPassword: confirmPassword
    };
    const headers = new HttpHeaders({
      'accept': 'text/plain',
      'content-type': 'application/json'
    });
    return this.httpService.httpPost<any>(`${this.apiUrl}Profile/ChangePassword`, body, headers);
  }
}
