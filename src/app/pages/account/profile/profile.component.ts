import { Component } from '@angular/core';
import { ProfileIntroComponent } from './profile-intro/profile-intro.component';
import { UserDetailsComponent } from './user-details/user-details.component';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [ProfileIntroComponent, UserDetailsComponent],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export class ProfileComponent {
}