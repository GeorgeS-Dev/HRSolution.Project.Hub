import { Component } from '@angular/core';
import { jwtTokenClaims } from '../../../core/services/identity/models/token-claims.model';
import { TokenService } from '../../../core/services/identity/services/token.service';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    TranslateModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  userClaims: jwtTokenClaims | null = null;
  companyExists: boolean = false;
  title = 'Home Page';

  constructor(private tokenService: TokenService) {
    // Initialize variables with safe defaults
    this.companyExists = false;
    
    try {
      this.userClaims = this.tokenService.getDecodedToken();
      this.companyExists = this.userClaims?.companyId ? true : false;
    } catch (error) {
      console.error('Error in HomeComponent initialization:', error);
    }
  }
}