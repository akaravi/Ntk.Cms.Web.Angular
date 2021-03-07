import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {first} from 'rxjs/operators';
import {CaptchaModel, CoreAuthService, AuthUserForgetPasswordModel} from 'ntk-cms-api';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

enum ErrorStates {
    NotSubmitted,
    HasError,
    NoError,
}

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
    forgotPasswordForm: FormGroup;
    errorState: ErrorStates = ErrorStates.NotSubmitted;
    errorStates = ErrorStates;
    isLoading$: Observable<boolean>;
    forgetPasswordModel: AuthUserForgetPasswordModel = new AuthUserForgetPasswordModel();
    captchaModel: CaptchaModel = new CaptchaModel();
    // private fields
    unsubscribe: Subscription[] = [];

    constructor(
        private fb: FormBuilder,
        private coreAuthService: CoreAuthService,
        private cmsToastrService: ToastrService,
        private router: Router
    ) {

    }

    ngOnInit(): void {
        this.onCaptchaOrder();
        this.initForm();
    }

    // convenience getter for easy access to form fields
    get f(): any {
        return this.forgotPasswordForm.controls;
    }

    initForm(): void {
        this.forgotPasswordForm = this.fb.group({
            email: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.email,
                    Validators.minLength(3),
                    Validators.maxLength(320),
                ]),
            ],
            mobile: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(11),
                ]),
            ],
            captcha: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ]
        });
    }

    submit(): void {
        this.errorState = ErrorStates.NotSubmitted;
        this.forgetPasswordModel.CaptchaKey = this.captchaModel.Key;
        const forgotPasswordSubscr = this.coreAuthService
            .ServiceForgetPassword(this.forgetPasswordModel)
            .pipe(first())
            .subscribe((res) => {
                if (res.IsSuccess) {
                    this.cmsToastrService.success('عملیات با موفقیت انجام شد');
                    this.router.navigate(['/']);
                }
            });
        this.unsubscribe.push(forgotPasswordSubscr);
    }

    onCaptchaOrder(): void {
        this.forgetPasswordModel.CaptchaText = '';
        this.coreAuthService.ServiceCaptcha().subscribe(
            (next) => {
                this.captchaModel = next.Item;
            }
        );
    }
}
