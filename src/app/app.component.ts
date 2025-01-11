declare let $: any;
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { ToggleService } from '../app/common/header/toggle.service';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { CommonModule, Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { RouterOutlet, Router, NavigationCancel, NavigationEnd, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { LoadingService } from './core/services/loading.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AuthService } from './core/services/identity/services/auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, CommonModule, SidebarComponent, HeaderComponent, FooterComponent, TranslateModule, MatProgressSpinner],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    providers: [
        Location, {
            provide: LocationStrategy,
            useClass: PathLocationStrategy
        }
    ]
})
export class AppComponent implements OnInit {
    title = 'Trinta -  Angular 18 Material Design Admin Dashboard Template';
    routerSubscription: any;
    location: any;
    loading: boolean = false;
    showHeader = true;

    constructor(private translate: TranslateService,
        public router: Router,
        public toggleService: ToggleService,
        private loadingService: LoadingService,
        private authService: AuthService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { 
        this.showHeader = !this.router.url.startsWith('/auth');
        this.translate.addLangs(['en']);
        this.translate.setDefaultLang('en');
        this.translate.use('en');
        this.toggleService.isToggled$.subscribe(isToggled => {
        this.isToggled = isToggled;
        });
        this.loadingService.loading$.subscribe((isLoading) => {
            this.loading = isLoading;
        });
    }

    // Toggle Service
    isToggled = false;

    // Dark Mode
    toggleTheme() {
        this.toggleService.toggleTheme();
    }

    // Settings Button Toggle
    toggle() {
        this.toggleService.toggle();
    }

    // ngOnInit
    ngOnInit(){
        if (isPlatformBrowser(this.platformId)) {
            this.recallJsFuntions();
        }
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.showHeader = !this.router.url.includes('/auth');
            }
        });

        this.authService.onLogin.subscribe(() => {
            this.showHeader = true;
        });
    }

    // recallJsFuntions
    recallJsFuntions() {
        this.routerSubscription = this.router.events
            .pipe(filter(event => event instanceof NavigationEnd || event instanceof NavigationCancel))
            .subscribe(event => {
            this.location = this.router.url;
            if (!(event instanceof NavigationEnd)) {
                return;
            }
            this.scrollToTop();
        });
    }
    scrollToTop() {
        if (isPlatformBrowser(this.platformId)) {
            window.scrollTo(0, 0);
        }
    }

}