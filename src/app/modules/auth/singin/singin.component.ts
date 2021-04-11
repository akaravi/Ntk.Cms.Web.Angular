import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable, interval } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthUserSignInModel, CaptchaModel, CoreAuthService, FormInfoModel } from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-auth-singin',
  templateUrl: './singin.component.html',
  styleUrls: ['./singin.component.scss'],
})
export class AuthSingInComponent implements OnInit, OnDestroy {
  formInfo: FormInfoModel = new FormInfoModel();

  dataModel: AuthUserSignInModel = new AuthUserSignInModel();
  captchaModel: CaptchaModel = new CaptchaModel();
  expireDate: string;
  aoutoCaptchaOrder = 1;

  // KeenThemes mock, change it to:
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
    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/';

  }


  onActionSubmit(): void {
    this.formInfo.ButtonSubmittedEnabled = false;
    this.hasError = false;
    this.dataModel.CaptchaKey = this.captchaModel.Key;
    this.coreAuthService.ServiceSigninUser(this.dataModel).subscribe(
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
    this.dataModel.CaptchaText = '';
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
