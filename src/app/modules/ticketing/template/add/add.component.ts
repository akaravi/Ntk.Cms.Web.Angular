import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  TicketingTemplateModel,
  TicketingTemplateService,
  CoreEnumService,
  EnumModel,
  ErrorExceptionResult,
  FormInfoModel,
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CmsFormsErrorStateMatcher } from 'src/app/core/pipe/cmsFormsErrorStateMatcher';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';


@Component({
  selector: 'app-ticketing-template-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class TicketingTemplateAddComponent implements OnInit {
  requestParentId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cmsStoreService: CmsStoreService,
    private dialogRef: MatDialogRef<TicketingTemplateAddComponent>,
    public coreEnumService: CoreEnumService,
    public ticketingTemplateService: TicketingTemplateService,
    private cmsToastrService: CmsToastrService
  ) {
    if (data) {
      this.requestParentId = +data.parentId || 0;
    }

  }

  formMatcher = new CmsFormsErrorStateMatcher();

  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<TicketingTemplateModel> = new ErrorExceptionResult<TicketingTemplateModel>();
  dataModel: TicketingTemplateModel = new TicketingTemplateModel();
  @ViewChild('vform', { static: false }) formGroup: FormGroup;

  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();


  ngOnInit(): void {

      this.formInfo.FormTitle = 'ثبت محتوای جدید';
    this.getEnumRecordStatus();
  }

  storeSnapshot = this.cmsStoreService.getStateSnapshot();
  getEnumRecordStatus(): void {
    if (this.storeSnapshot && this.storeSnapshot.EnumRecordStatus && this.storeSnapshot.EnumRecordStatus && this.storeSnapshot.EnumRecordStatus.IsSuccess && this.storeSnapshot.EnumRecordStatus.ListItems && this.storeSnapshot.EnumRecordStatus.ListItems.length > 0) {
      this.dataModelEnumRecordStatusResult = this.storeSnapshot.EnumRecordStatus;
    }
  }

  DataAddContent(): void {
    this.formInfo.FormAlert = 'در حال ارسال اطلاعات به سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;
    if (this.requestParentId > 0) {
      this.dataModel.LinkTicketingDepartemenId = this.requestParentId;
    }

    this.ticketingTemplateService.ServiceAdd(this.dataModel).subscribe(
      (next) => {
        this.formInfo.FormAllowSubmit = true;
        this.dataModelResult = next;
        if (next.IsSuccess) {
          this.formInfo.FormAlert = 'ثبت با موفقیت انجام شد';
          this.cmsToastrService.typeSuccessAdd();
          this.dialogRef.close({ dialogChangedDate: true });
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = next.ErrorMessage;
        }
        this.loading.display = false;
      },
      (error) => {
        this.formInfo.FormAllowSubmit = true;
        this.cmsToastrService.typeError(error);
        this.loading.display = false;
      }
    );
  }
  DataEditContent(): void {
    this.formInfo.FormAlert = 'در حال ارسال اطلاعات به سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;

    this.ticketingTemplateService.ServiceEdit(this.dataModel).subscribe(
      (next) => {
        this.formInfo.FormAllowSubmit = true;
        this.dataModelResult = next;
        if (next.IsSuccess) {
          this.formInfo.FormAlert = 'ثبت با موفقیت انجام شد';
          this.cmsToastrService.typeSuccessEdit();
          this.dialogRef.close({ dialogChangedDate: true });

        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = next.ErrorMessage;
        }
        this.loading.display = false;
      },
      (error) => {
        this.formInfo.FormAllowSubmit = true;
        this.cmsToastrService.typeError(error);
        this.loading.display = false;
      }
    );
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.FormAllowSubmit = false;

      this.DataAddContent();

  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
