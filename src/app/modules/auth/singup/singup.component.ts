import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthUserSignUpModel, CaptchaModel, CoreAuthService, FormInfoModel } from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { MatDialog } from '@angular/material/dialog';
import { SingupRuleComponent } from '../singupRule/singupRule.Component';

@Component({
  selector: 'app-auth-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.scss'],
})
export class AuthSingUpComponent implements OnInit, OnDestroy {
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  constructor(
    private cmsToastrService: CmsToastrService,
    private router: Router,
    private coreAuthService: CoreAuthService,
    public dialog: MatDialog
  ) {

  }
  formInfo: FormInfoModel = new FormInfoModel();
  hasError: boolean;
  Roulaccespt = false;
  isLoading$: Observable<boolean>;
  captchaModel: CaptchaModel = new CaptchaModel();
  dataModel: AuthUserSignUpModel = new AuthUserSignUpModel();
  loading = new ProgressSpinnerModel();
  ngOnInit(): void {
    this.onCaptchaOrder();
  }
  ngOnDestroy(): void {
  }
  onActionSubmit(): void {
    this.hasError = false;
    this.dataModel.CaptchaKey = this.captchaModel.Key;
     this.coreAuthService.ServiceSignupUser(this.dataModel).subscribe((next) => {
        if (next.IsSuccess) {
          this.cmsToastrService.typeSuccessRegistery();
          this.router.navigate(['/']);
        } else {
          this.cmsToastrService.typeErrorRegistery(next.ErrorMessage);
          this.hasError = true;
          this.onCaptchaOrder();
        }
      }, (error) => {
        this.cmsToastrService.typeError(error);
      });
  }
  onRoulaccespt(): void {
    const dialogRef = this.dialog.open(SingupRuleComponent);

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      this.Roulaccespt=result;
    });
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

}
