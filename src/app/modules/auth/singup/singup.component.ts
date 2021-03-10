import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { first } from 'rxjs/operators';
import { AuthUserSignUpModel, CaptchaModel, CoreAuthService } from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';

@Component({
  selector: 'app-auth-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.scss'],
})
export class AuthSingUpComponent implements OnInit, OnDestroy {
  hasError: boolean;
  Roulaccespt = false;
  isLoading$: Observable<boolean>;

  captchaModel: CaptchaModel = new CaptchaModel();
  dataModel: AuthUserSignUpModel = new AuthUserSignUpModel();
  loading = new ProgressSpinnerModel();
  @ViewChild('vform', { static: false }) formGroup: FormGroup;

  private unsubscribe: Subscription[] = [];

  constructor(
    private cmsToastrService: CmsToastrService,
    private fb: FormBuilder,
    private router: Router,
    private coreAuthService: CoreAuthService
  ) {
    if (this.coreAuthService.CurrentTokenInfoRenew()) {

      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.onCaptchaOrder();
  }

  onFormSubmit(): void {
    this.hasError = false;
    this.dataModel.CaptchaKey = this.captchaModel.Key;
    const registrationSubscr = this.coreAuthService
      .ServiceSignupUser(this.dataModel)
      .pipe(first())
      .subscribe((res) => {
        if (res.IsSuccess) {
          this.cmsToastrService.typeSuccessRegistery();
          this.router.navigate(['/']);
        } else {
          this.cmsToastrService.typeErrorRegistery(res.ErrorMessage);
          this.hasError = true;
          this.onCaptchaOrder();
        }
      }, (error) => {
        this.cmsToastrService.typeError(error);
      });
    this.unsubscribe.push(registrationSubscr);
  }
  onRoulaccespt(): void {

  }
  onActionSubmit(): void {

  }

  onCaptchaOrder(): void {
    this.dataModel.CaptchaText = '';
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
