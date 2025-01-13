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

export const routes: Routes = [
    { path: '', canActivate: [AuthGuard], children: [
        // {path: '', component: EcommerceComponent},
        {path: 'blank-page', component: BlankPageComponent},
        {path: 'internal-error', component: InternalErrorComponent},
        {path: 'profile', component: ProfileComponent},
    ]},
    {
        path: 'auth',
        component: AuthenticationComponent,
        children: [
            {path: '', component: SignInComponent, },
            {path: 'sign-in', component: SignInComponent},
            {path: 'sign-up', component: SignUpComponent},
            {path: 'confirm-email', component: ConfirmEmailComponent},
            {path: 'email-confirmed', component: EmailConfirmedComponent}
        ]
    },

    {path: '**', component: NotFoundComponent, canActivate: [AuthGuard]}
];