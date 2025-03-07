import { Component } from '@angular/core';
import { jwtTokenClaims } from '../../../core/services/identity/models/token-claims.model';
import { TokenService } from '../../../core/services/identity/services/token.service';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgIf,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
    userClaims: jwtTokenClaims | null = null;
    companyExists: boolean = false;
  title = 'Home Page';

  constructor(private tokenService: TokenService
      ) {
        this.userClaims = tokenService.getDecodedToken();
        this.companyExists = this.userClaims === null || !this.userClaims.companyId ? false : true;
  }
}