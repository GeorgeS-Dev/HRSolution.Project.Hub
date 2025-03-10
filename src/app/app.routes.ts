import { Routes } from '@angular/router';
import { NotFoundComponent } from './common/not-found/not-found.component';
import { BlankPageComponent } from './blank-page/blank-page.component';
import { InternalErrorComponent } from './common/internal-error/internal-error.component';
import { AuthenticationComponent } from './pages/authentication/authentication.component';
import { SignInComponent } from './pages/authentication/sign-in/sign-in.component';
import { ConfirmEmailComponent } from './pages/authentication/confirm-email/confirm-email.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ProfileComponent } from './pages/account/profile/profile.component';
import { SignUpComponent } from './pages/authentication/sign-up/sign-up.component';
import { EmailConfirmedComponent } from './pages/authentication/email-confirmed/email-confirmed.component';
import { ForgotPasswordComponent } from './pages/authentication/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/authentication/reset-password/reset-password.component';
import { CreateCompanyComponent } from './pages/organization/company/create/create-company.component';
import { HomeComponent } from './pages/organization/home/home.component';

export const routes: Routes = [
    // Consolidate the root path to avoid conflicts
    { 
        path: '',
        pathMatch: 'full', // Add this to ensure exact path matching
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    { 
        path: '',
        canActivate: [AuthGuard],
        children: [
            {path: 'blank-page', component: BlankPageComponent},
            {path: 'internal-error', component: InternalErrorComponent},
            {path: 'profile', component: ProfileComponent},
        ]
    },
    {
        path: 'organization',
        canActivate: [AuthGuard],
        children: [
            {path: 'create' , component: CreateCompanyComponent},
        ] 
    },
    {
        path: 'auth',
        component: AuthenticationComponent,
        children: [
            {path: '', component: SignInComponent},
            {path: 'sign-in', component: SignInComponent},
            {path: 'sign-up', component: SignUpComponent},
            {path: 'confirm-email', component: ConfirmEmailComponent},
            {path: 'email-confirmed', component: EmailConfirmedComponent},
            {path: 'forgot-password', component: ForgotPasswordComponent},
            {path: 'reset-password', component: ResetPasswordComponent}
        ]
    },
    {path: '**', component: NotFoundComponent, canActivate: [AuthGuard]}
];