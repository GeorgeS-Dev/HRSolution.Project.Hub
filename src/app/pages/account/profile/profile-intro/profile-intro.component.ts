import { Component, Inject, NgModule, Injector, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { jwtTokenClaims } from '../../../../core/services/identity/models/token-claims.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TokenService } from '../../../../core/services/identity/services/token.service';
import { NgClass, NgIf } from '@angular/common';
import {
    MatDialog,
    MatDialogRef,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { IdentityService } from '../../../../core/services/identity/services/identity.service';
import { ApiError } from '../../../../core/services/api-response';
import { QRCodeModule  } from 'angularx-qrcode';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, NgModel, NgModelGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SignInResponse } from '../../../../core/services/identity/models/sign-in-response.model';
import { AuthService } from '../../../../core/services/identity/services/auth.service';

@Component({
    selector: 'app-profile-intro',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatTooltipModule, NgIf],
    templateUrl: './profile-intro.component.html',
    styleUrl: './profile-intro.component.scss'
})

export class ProfileIntroComponent implements OnInit {
    userClaims: jwtTokenClaims | null = null;

    constructor(
        private injector: Injector,
        public dialog: MatDialog,
        private tokenService: TokenService,
        private authService: AuthService // Add AuthService
    ) {
        this.authService.onLogin.subscribe(() => {
            this.loadUserClaims();
        });
    }

    ngOnInit(): void {
        this.loadUserClaims();
    }

    loadUserClaims(): void {
        const decodedToken = this.tokenService.getDecodedToken();
        if (decodedToken) {
            this.userClaims = decodedToken;
        }
    }

    openTwoFactorDialog(): void {
        this.dialog.open(TwoFactorWarnDialog, {
            width: '550px',
        });
    }

    openDisableTwoFactorDialog(): void {
        this.dialog.open(TwoFactorDisableDialog, {
            width: '550px',
        });
    }
}

@Component({
    selector: 'TwoFactorWarnDialog',
    templateUrl: './dialogs/two-factors/warn.dialog.html',
    standalone: true,
    imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
})
export class TwoFactorWarnDialog {

    constructor(
        public dialogRef: MatDialogRef<TwoFactorWarnDialog>,
        public dialog: MatDialog,
        private identityService: IdentityService
    ) {}
    confirm2FAActivation(): void {
        this.dialog.closeAll();
        this.identityService.twoFactorEnableSend().subscribe({
            next: (data: string) => {
                this.dialog.open(TwoFactorCodeDialog, {
                    width: '550px',
                    data: data
                });
            },
            error: (error: ApiError) => {
                // Show Unknown Error
            }
        });
    }
}

@Component({
    selector: 'TwoFactorCodeDialog',
    templateUrl: './dialogs/two-factors/code.dialog.html',
    styleUrl: './profile-intro.component.scss',
    standalone: true,
    imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, QRCodeModule, MatFormFieldModule, MatInputModule, FormsModule, NgClass, NgIf ],
})
export class TwoFactorCodeDialog {
twoFactorString: string = "";
verificationCode: string = '';
isCodeInvalid: boolean = false;
    constructor(
        public dialogRef: MatDialogRef<TwoFactorCodeDialog>,
        public dialog: MatDialog,
        private identityService: IdentityService,
        @Inject(MAT_DIALOG_DATA) public data: string,
        private tokenService: TokenService,
        private authService: AuthService
    ) {
        this.twoFactorString = data;
    }
    confirm2FAActivation(): void {

    }
    validateCode() {
        this.identityService.twoFactorEnableConfirm(this.verificationCode).subscribe({
            next: () => {
                const refreshToken = this.tokenService.getRefreshToken();
                if (refreshToken) {
                    this.identityService.refreshToken(refreshToken).subscribe({
                        next: (data: SignInResponse) => {
                            this.tokenService.setToken(data.accessToken, data.accessTokenExpires, data.refreshToken, data.refreshTokenExpires); // Set the tokens in TokenService
                            this.authService.onLogin.emit(); 
                            this.dialog.closeAll();
                            this.dialog.open(TwoFactorCodeConfirmDialog, {
                                width: '550px'
                            });
                        },
                        error: (error: ApiError) => {
                            this.isCodeInvalid = true;
                        }
                    });
                }
            },
            error: (error: ApiError) => {
                this.isCodeInvalid = true;
            }
        });
      }
}

@Component({
    selector: 'TwoFactorCodeConfirmDialog',
    templateUrl: './dialogs/two-factors/code-confirm.dialog.html',
    standalone: true,
    imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
})
export class TwoFactorCodeConfirmDialog {

    constructor(
        public dialogRef: MatDialogRef<TwoFactorCodeConfirmDialog>,
        public dialog: MatDialog,
        private identityService: IdentityService
    ) {}
}

@Component({
    selector: 'TwoFactorDisableDialog',
    templateUrl: './dialogs/two-factors/disable.dialog.html',
    standalone: true,
    imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, NgIf],
})
export class TwoFactorDisableDialog {
hasDisabled: boolean = false;
hasError: boolean = false;
    constructor(
        public dialogRef: MatDialogRef<TwoFactorDisableDialog>,
        public dialog: MatDialog,
        private identityService: IdentityService,
        private tokenService: TokenService,
        private authService: AuthService
    ) {}

    DisableTwoFactor() : void {

        this.identityService.disableTwoFactor().subscribe({
            next: () => {
                const refreshToken = this.tokenService.getRefreshToken();
                if (refreshToken) {
                    this.identityService.refreshToken(refreshToken).subscribe({
                        next: (data: SignInResponse) => {
                            console.log(data);
                            this.tokenService.setToken(data.accessToken, data.accessTokenExpires, data.refreshToken, data.refreshTokenExpires); // Set the tokens in TokenService
                            this.authService.onLogin.emit(); 
                        },
                        error: (error: ApiError) => {
                            this.hasError = true;
                        }
                    });
                }
            },
            error: (error: ApiError) => {
                this.hasError = true;
            }
        });
    }
}