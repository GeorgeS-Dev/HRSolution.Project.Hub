import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/identity/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isAuthPath = state.url.startsWith('/auth/');

    if (this.authService.hasAccessToken()) {
      return true;
    }

    if (isAuthPath) {
      return true;
    }

    this.router.navigate(['/auth/login']);
    return false;
  }
}
