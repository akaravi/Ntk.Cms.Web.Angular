import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable, interval } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthUserSignInModel, CaptchaModel, CoreAuthService, FormInfoModel } from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class AuthLoginComponent implements OnInit, OnDestroy {
  formInfo: FormInfoModel = new FormInfoModel();

  modelData: AuthUserSignInModel = new AuthUserSignInModel();
  captchaModel: CaptchaModel = new CaptchaModel();
  expireDate: string;
  aoutoCaptchaOrder = 1;

  // KeenThemes mock, change it to:
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;

  // private fields
  unsubscribe: Subscription[] = [];

  constructor(
    private cmsToastrService: CmsToastrService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private coreAuthService: CoreAuthService
  ) {

  }

  ngOnInit(): void {
    this.onCaptchaOrder();
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/';

  }

  // convenience getter for easy access to form fields
  get f(): any {
    return this.loginForm.controls;
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      captcha: [
        '',
        Validators.compose([
          Validators.required
        ]),
      ],
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320),
        ]),
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  onActionSubmit(): void {
    this.formInfo.ButtonSubmittedEnabled = false;
    this.hasError = false;
    this.modelData.CaptchaKey = this.captchaModel.Key;
    this.coreAuthService.ServiceSigninUser(this.modelData).subscribe(
      (res) => {
        if (res.IsSuccess) {
          this.cmsToastrService.typeSuccessLogin();
          this.router.navigate(['/core/site/selection']);
        } else {
          this.formInfo.ButtonSubmittedEnabled = true;
          this.cmsToastrService.typeErrorLogin(res.ErrorMessage);
          this.onCaptchaOrder();
        }
      },
      (error) => {
        this.formInfo.ButtonSubmittedEnabled = true;
        this.cmsToastrService.typeError(error);
      }
    );
  }

  onCaptchaOrder(): void {
    this.modelData.CaptchaText = '';
    this.coreAuthService.ServiceCaptcha().subscribe(
      (next) => {

        this.captchaModel = next.Item;
        this.expireDate = next.Item.Expire.split('+')[1];
        const startDate = new Date();
        const endDate = new Date(next.Item.Expire);
        const seconds = (endDate.getTime() - startDate.getTime());
        if (this.aoutoCaptchaOrder < 10) {
          this.aoutoCaptchaOrder = this.aoutoCaptchaOrder + 1;
          setTimeout(() => { this.onCaptchaOrder(); }, seconds);
        }
        if (!next.IsSuccess) {
          this.cmsToastrService.typeErrorGetCpatcha(next.ErrorMessage);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
