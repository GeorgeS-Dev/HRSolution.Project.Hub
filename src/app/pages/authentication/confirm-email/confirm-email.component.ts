import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
    selector: 'app-confirm-email',
    standalone: true,
    imports: [RouterLink, MatButtonModule, FeathericonsModule, TranslateModule],
    templateUrl: './confirm-email.component.html',
    styleUrl: './confirm-email.component.scss'
})
export class ConfirmEmailComponent {
    email: string | null = null;

    constructor(private route: ActivatedRoute, private router: Router, private loadingService: LoadingService) {}
  
    ngOnInit(): void {
      // Retrieve the email from the query parameters
      this.route.queryParams.subscribe(params => {
        this.email = params['email'];
        this.email = params['email'] || null;
        if (!this.email) {
          // Redirect to sign-in page if email is null or empty
          this.router.navigate(['/auth/sign-in']);
        }
        this.loadingService.hide();
      });
    }
}