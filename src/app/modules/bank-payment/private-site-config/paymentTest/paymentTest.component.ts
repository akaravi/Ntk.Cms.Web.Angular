import {
  CoreEnumService,
  FormInfoModel,
  BankPaymentPrivateSiteConfigService,
  BankPaymentPrivateSiteConfigModel,
  BankPaymentInjectOnlineTransactionDtoModel,
  ErrorExceptionResult,
  BankPaymentInjectPaymentGotoBankStep2LandingSitePageModel,
} from 'ntk-cms-api';
import {
  Component,
  OnInit,
  ViewChild,
  Inject,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { DOCUMENT } from '@angular/common';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-bankpayment-privateconfig-paymenttest',
  templateUrl: './paymentTest.component.html',
  styleUrls: ['./paymentTest.component.scss'],
})
export class BankPaymentPrivateSiteConfigPaymentTestComponent implements OnInit {
  requestLinkPrivateSiteConfigId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(DOCUMENT) private document: any,
    private dialogRef: MatDialogRef<BankPaymentPrivateSiteConfigPaymentTestComponent>,
    public coreEnumService: CoreEnumService,
    public bankPaymentPrivateSiteConfigService: BankPaymentPrivateSiteConfigService,
    private cmsToastrService: CmsToastrService,
  ) {
    if (data) {
      this.requestLinkPrivateSiteConfigId = +data.LinkPrivateSiteConfigId || 0;
    }
    this.dataModel.LastUrlAddressInUse = this.document.location.href;
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  loading = new ProgressSpinnerModel();
  dataModelParentSelected: BankPaymentPrivateSiteConfigModel = new BankPaymentPrivateSiteConfigModel();
  dataModel: BankPaymentInjectOnlineTransactionDtoModel = new BankPaymentInjectOnlineTransactionDtoModel();
  dataModelResult: ErrorExceptionResult<BankPaymentInjectPaymentGotoBankStep2LandingSitePageModel> = new ErrorExceptionResult<BankPaymentInjectPaymentGotoBankStep2LandingSitePageModel>();
  formInfo: FormInfoModel = new FormInfoModel();

  ngOnInit(): void {
    if (this.requestLinkPrivateSiteConfigId <= 0) {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.dataModel.BankPaymentPrivateId = this.requestLinkPrivateSiteConfigId;
  }



  onActionSelectPrivateSiteConfig(model: BankPaymentPrivateSiteConfigModel): void {
    this.dataModel.BankPaymentPrivateId = null;
    this.dataModelParentSelected = model;
    if (model && model.Id > 0) {
      this.dataModel.BankPaymentPrivateId = model.Id;
    }
  }
  dataModelResultGotoBank = false;
  onGotoBank(): void {
    if (this.dataModelResultGotoBank && this.dataModelResult.IsSuccess && this.dataModelResult.Item.UrlToPay.length > 0) {
      this.cmsToastrService.typeSuccessMessage('درحال انتقال به درگاه پرداخت');
      this.document.location.href = this.dataModelResult.Item.UrlToPay;
    }
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    if (!this.dataModel.BankPaymentPrivateId || this.dataModel.BankPaymentPrivateId <= 0) {
      this.cmsToastrService.typeErrorFormInvalid();
    }
    if (!this.dataModel.Amount || this.dataModel.Amount <= 0) {
      this.cmsToastrService.typeErrorFormInvalid();
    }
    this.formInfo.FormSubmitAllow = false;
    this.bankPaymentPrivateSiteConfigService.ServiceTestPay(this.dataModel).pipe(
      map((next) => {
        this.formInfo.FormSubmitAllow = true;
        this.dataModelResult = next;
        if (next.IsSuccess) {
          this.formInfo.FormAlert = 'درخواست پرداخت با موفقیت ثبت شد';
          this.cmsToastrService.typeSuccessMessage('درخواست پرداخت با موفقیت ثبت شد');
          this.dataModelResultGotoBank = true;


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
      )).toPromise()
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}