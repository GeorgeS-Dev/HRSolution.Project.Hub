import { Component, Injector, OnInit } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { Router, RouterLink } from '@angular/router';
import { ToggleService } from './toggle.service';
import { AuthService } from '../../core/services/identity/services/auth.service';
import { TokenService } from '../../core/services/identity/services/token.service';
import { jwtTokenClaims } from '../../core/services/identity/models/token-claims.model';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [FeathericonsModule, MatButtonModule, MatMenuModule, RouterLink, NgClass],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    providers: [
        DatePipe
    ]
})
export class HeaderComponent implements OnInit {
    userClaims: jwtTokenClaims = {} as jwtTokenClaims;
    private tokenService: TokenService;

    constructor(
        private authService: AuthService,
        public toggleService: ToggleService,
        private datePipe: DatePipe,
        private router: Router,
        private injector: Injector
    ) {
        this.tokenService = this.injector.get(TokenService);
        this.toggleService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
        this.formattedDate = this.datePipe.transform(this.currentDate, 'dd MMMM yyyy');
        this.authService.onLogin.subscribe(() => {
            this.reloadUserClaims();
        });
    }

    ngOnInit(): void {
        this.reloadUserClaims();
    }

    private reloadUserClaims(): void {
        const decodedToken = this.tokenService.getDecodedToken();
        if (decodedToken) {
            this.userClaims = decodedToken;
        }
    }

    // Toggle Service
    isToggled = false;
    toggle() {
        this.toggleService.toggle();
    }

    // Dark Mode
    toggleTheme() {
        this.toggleService.toggleTheme();
    }

    // Current Date
    currentDate: Date = new Date();
    formattedDate: any;

    public logOut() {
        this.authService.clearAccessToken();
        this.tokenService.removeToken();
        this.router.navigate(['/auth/login']);
    }
}