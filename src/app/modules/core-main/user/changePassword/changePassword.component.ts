import {
  CoreEnumService,
  EnumModel,
  ErrorExceptionResult,
  FormInfoModel,
  CoreAuthService,
  CoreUserModel,
  AccessModel,
  DataFieldInfoModel,
  CoreModuleModel,
  FilterModel,
  FilterDataModel,
  AuthUserChangePasswordModel,
  NtkCmsApiStoreService,
  TokenInfoModel
} from 'ntk-cms-api';
import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  OnDestroy,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import {
  TreeModel,
  NodeInterface,
} from 'ntk-cms-filemanager';
import { CmsFormsErrorStateMatcher } from 'src/app/core/pipe/cmsFormsErrorStateMatcher';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-core-user-changepassword',
  templateUrl: './changePassword.component.html',
  styleUrls: ['./changePassword.component.scss'],
})
export class CoreUserChangePasswordComponent implements OnInit, OnDestroy {
  requestLinkUserId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cmsStoreService: CmsStoreService,
    private dialogRef: MatDialogRef<CoreUserChangePasswordComponent>,
    private cmsApiStore: NtkCmsApiStoreService,
    public coreEnumService: CoreEnumService,
    public coreAuthService: CoreAuthService,
    private cmsToastrService: CmsToastrService,
    private translate: TranslateService,
    public publicHelper: PublicHelper,
  ) {
    if (data) {
      this.requestLinkUserId = +data.LinkUserId || 0;
    }
    this.NewPasswordRepeat = '';
  }
  tokenInfo = new TokenInfoModel();

  NewPasswordRepeat: string;
  passwordIsValid = false;


  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<CoreUserModel> = new ErrorExceptionResult<CoreUserModel>();
  dataModel: AuthUserChangePasswordModel = new AuthUserChangePasswordModel();
  @ViewChild('vform', { static: false }) formGroup: FormGroup;

  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  dataAccessModel: AccessModel;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  fileManagerOpenForm = false;
  storeSnapshot = this.cmsStoreService.getStateSnapshot();
  dataCoreUserIds: number[] = [];
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.formInfo.FormTitle = 'تغییر کلمه عبور  ';
    this.tokenInfo = this.cmsApiStore.getStateSnapshot().ntkCmsAPiState.tokenInfo;
    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe((next) => {
      this.tokenInfo = next;
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataEditContent(): void {
    this.formInfo.FormAlert = 'در حال ارسال اطلاعات به سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;
    if (this.requestLinkUserId > 0) {
      this.dataModel.LinkUserId = this.requestLinkUserId;
    }
    this.coreAuthService.ServiceChangePassword(this.dataModel).subscribe(
      (next) => {
        this.formInfo.FormSubmitAllow = true;
        if (next.IsSuccess) {
          this.formInfo.FormAlert = 'ثبت با موفقیت انجام شد';
          this.cmsToastrService.typeSuccessEdit();
          this.dialogRef.close({ dialogChangedDate: true });
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = next.ErrorMessage;
          this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
        }
        this.loading.display = false;
      },
      (error) => {
        this.formInfo.FormSubmitAllow = true;
        this.cmsToastrService.typeError(error);
        this.loading.display = false;
      }
    );
  }
  passwordValid(event): void {
    this.passwordIsValid = event;
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    if (this.tokenInfo.UserAccessAdminAllowToProfessionalData) {
      if (!this.dataModel.OldPassword || this.dataModel.OldPassword.length === 0) {
        this.dataModel.OldPassword = '000';
      }
    } else {
      if (!this.dataModel.OldPassword || this.dataModel.OldPassword.length === 0) {
        this.cmsToastrService.typeErrorMessage(this.translate.instant('MESSAGE.Enter_the_previous_password'));

        return;
      }
    }
    if (!this.dataModel.NewPassword || this.dataModel.NewPassword.length === 0) {
      this.cmsToastrService.typeErrorMessage(this.translate.instant('MESSAGE.Enter_the_new_password'));



      return;
    }
    if (this.dataModel.NewPassword !== this.NewPasswordRepeat) {
      this.cmsToastrService.typeErrorMessage(this.translate.instant('MESSAGE.The_new_password_is_equivalent_to_a_duplicate'));


      return;
    }
    this.formInfo.FormSubmitAllow = false;
    this.DataEditContent();
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
  onStepClick(event: StepperSelectionEvent, stepper: MatStepper): void {
    if (event.previouslySelectedIndex < event.selectedIndex) {
      if (!this.formGroup.valid) {
        this.cmsToastrService.typeErrorFormInvalid();
        setTimeout(() => {
          stepper.selectedIndex = event.previouslySelectedIndex;
          // stepper.previous();
        }, 10);
      }
    }
  }

}
