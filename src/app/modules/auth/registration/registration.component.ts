import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { first } from 'rxjs/operators';
import { AuthUserSignUpModel, CaptchaModel, CoreAuthService } from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;
  registerModel: AuthUserSignUpModel = new AuthUserSignUpModel();
  captchaModel: CaptchaModel = new CaptchaModel();

  // private fields
  private unsubscribe: Subscription[] = [];

  constructor(
    private cmsToastrService: CmsToastrService,
    private fb: FormBuilder,
    private router: Router,
    private coreAuthService: CoreAuthService
  ) {
    if (this.coreAuthService.CurrentTokenInfoBS) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.onCaptchaOrder();
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f(): any {
    return this.registrationForm.controls;
  }

  initForm(): void {
    this.registrationForm = this.fb.group(
      {
        firstName: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        lastName: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        email: [
          '',
          Validators.compose([
            Validators.required,
            Validators.email,
            Validators.minLength(3),
            Validators.maxLength(320),
            // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
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
        cPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        captcha: [
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
        agree: [false, Validators.compose([Validators.required])],
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );
  }

  submit(): void {
    this.hasError = false;
    this.registerModel.CaptchaKey = this.captchaModel.Key;
    const registrationSubscr = this.coreAuthService
      .ServiceSignupUser(this.registerModel)
      .pipe(first())
      .subscribe((res) => {
        if (res.IsSuccess) {
          this.cmsToastrService.typeSuccessRegistery();

          this.router.navigate(['/']);
        } else {
          this.cmsToastrService.typeErrorRegistery(res.ErrorMessage);

          this.hasError = true;
        }
      });
    this.unsubscribe.push(registrationSubscr);
  }

  onCaptchaOrder(): void {
    this.registerModel.CaptchaText = '';
    this.coreAuthService.ServiceCaptcha().subscribe(
      (next) => {
        this.captchaModel = next.Item;
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
