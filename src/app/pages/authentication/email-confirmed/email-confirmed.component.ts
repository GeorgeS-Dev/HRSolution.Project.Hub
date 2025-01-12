import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { TranslateModule } from '@ngx-translate/core';
import { ApiError } from '../../../core/services/api-response';
import { LoadingService } from '../../../core/services/loading.service';
import { ErrorHandlerService } from '../../../core/services/http/error-handler.service';
import { IdentityService } from '../../../core/services/identity/services/identity.service';
import { ConfirmEmailRequest } from '../../../core/services/identity/models/confirm-email.request.model';

@Component({
    selector: 'app-email-confirmed',
    standalone: true,
    imports: [RouterLink, MatButtonModule, FeathericonsModule, TranslateModule],
    templateUrl: './email-confirmed.component.html',
    styleUrl: './email-confirmed.component.scss'
})
export class EmailConfirmedComponent {
    succeeded: boolean = false;
    userId: string = '';
    code: string = '';

    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private loadingService: LoadingService,
      private identityService: IdentityService
    ) {}
  
    ngOnInit(): void {
      // Retrieve the userId and code from the query parameters
      this.route.queryParams.subscribe(params => {
        this.userId = params['userid'] || null;
        this.code = params['code'] || null;
        console.log(this.userId);
        console.log(this.code);
        if (!this.userId || !this.code) {
          this.router.navigate(['/auth/sign-in']);
        } else {
          this.loadingService.show();
          const request: ConfirmEmailRequest = { userId: this.userId, code: this.code, isChangeEmail: false };
          this.identityService.confirmEmail(request).subscribe({
            next: () => {
              this.succeeded = true;
              this.loadingService.hide();
            },
            error: () => {
              this.succeeded = false;
              this.loadingService.hide();
            }
          });
        }
      });
    }
  }