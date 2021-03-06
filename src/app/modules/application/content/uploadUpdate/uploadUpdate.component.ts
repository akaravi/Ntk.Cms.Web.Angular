import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilePreviewModel } from 'ngx-awesome-uploader';
import { ApplicationAppModel, ApplicationAppService, DataFieldInfoModel, FormInfoModel, UploadApplictionDtoModel } from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-upload-update',
  templateUrl: './uploadUpdate.component.html',
  styleUrls: ['./uploadUpdate.component.scss']
})
export class ApplicationAppUploadUpdateComponent  implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public dataItemModel: ApplicationAppModel,
              private dialogRef: MatDialogRef<ApplicationAppUploadUpdateComponent>,
              private applicationAppService: ApplicationAppService,
              private toasterService: CmsToastrService,
              private publicHelper: PublicHelper
  ) {
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  formInfo: FormInfoModel = new FormInfoModel();
  dataModel = new UploadApplictionDtoModel();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  ngOnInit(): void {
    this.dataModel.AppVersion = this.dataItemModel.AppVersion;
    this.dataModel.LastBuildAppKey = this.dataItemModel.LastBuildAppKey;
    this.dataModel.LinkApplicationId = this.dataItemModel.Id;
    this.formInfo.FormSubmitAllow = false;
    this.DataGetAccess();
  }
  DataGetAccess(): void {
    this.applicationAppService
      .ServiceViewModel()
      .subscribe(
        async (next) => {
          if (next.IsSuccess) {
            this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);
          } else {
            this.toasterService.typeErrorGetAccess(next.ErrorMessage);
          }
        },
        (error) => {
          this.toasterService.typeErrorGetAccess(error);
        }
      );
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    if (!this.dataModel.UploadFileGUID || this.dataModel.UploadFileGUID.length === 0) {
      this.toasterService.typeErrorEdit('فایل آپلود نشده است');
      return;
    }
    if (!this.dataModel.LinkApplicationId || this.dataModel.LinkApplicationId > 0) {
      this.toasterService.typeErrorEdit('اپلکیشن مشخص نیست');
      return;
    }
    this.formInfo.FormSubmitAllow = false;
    this.applicationAppService.ServiceUploadUpdate(this.dataModel).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.formInfo.FormSubmitAllow = false;
          this.toasterService.typeSuccessAppUpload();
        } else {
          this.formInfo.FormSubmitAllow = true;
          this.toasterService.typeErrorEdit(next.ErrorMessage);
        }
      },
      (error) => {
        this.formInfo.FormSubmitAllow = true;
        this.toasterService.typeErrorEdit(error);
      });

  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }

  OnActionUploadSuccess(model: FilePreviewModel): void {
    // console.log(model);
    if (model.uploadResponse && model.uploadResponse.Item && model.uploadResponse.Item.FileKey) {
      this.dataModel.UploadFileGUID = model.uploadResponse.Item.FileKey;
      this.formInfo.FormSubmitAllow = true;
    }
  }
}
