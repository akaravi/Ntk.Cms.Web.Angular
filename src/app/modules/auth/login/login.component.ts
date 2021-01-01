import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription, Observable, interval} from 'rxjs';
import {AuthService} from '../_services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthUserSignInModel, CaptchaModel, CoreAuthService} from 'ntk-cms-api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {

  modelData: AuthUserSignInModel = new AuthUserSignInModel();
  captchaModel: CaptchaModel = new CaptchaModel();
  expireDate: string;
  source = interval(1000 * 60 * 5);

  // KeenThemes mock, change it to:
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;

  // private fields
  unsubscribe: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private coreAuthService: CoreAuthService
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    // if (this.authService.currentUserValue) {
    //     this.router.navigate(['/']);
    // }
  }

  ngOnInit(): void {
    this.onCaptchaOrder();
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
    this.source.subscribe(() => {
      this.onCaptchaOrder();
    });
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
    });
  }

  submit(): void {
    this.hasError = false;
    this.modelData.CaptchaKey = this.captchaModel.Key;
    this.coreAuthService.ServiceSigninUser(this.modelData).subscribe(
      (res) => {
        if (res.IsSuccess) {
          this.router.navigate(['/site/selection']);
        } else {
          this.onCaptchaOrder();
        }
      });
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
        setTimeout(() => {
          this.onCaptchaOrder();
        }, seconds);
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
