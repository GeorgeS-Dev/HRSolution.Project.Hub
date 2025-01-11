import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; 
import { TokenService } from './core/services/identity/services/token.service';
import { LoadingService } from './core/services/loading.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './core/services/http/http.interceptor';

@NgModule({
  imports: [
    BrowserModule
  ],
  providers: [
    TokenService,
    LoadingService
  ]
})
export class AppModule { }