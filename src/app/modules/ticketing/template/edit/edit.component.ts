import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AccessModel, ApplicationEnumService,
  TicketingTemplateModel,
  TicketingTemplateService,
  CoreEnumService,
  DataFieldInfoModel,
  EnumModel,
  ErrorExceptionResult,
  FormInfoModel,
  ApplicationSourceModel,
  FileContentModel,
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import { map, retry } from 'rxjs/operators';
import { ApplicationThemeConfigModel } from 'ntk-cms-api';
import { PoinModel } from 'src/app/core/models/pointModel';
import { Map as leafletMap } from 'leaflet';
import * as Leaflet from 'leaflet';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CmsFormsErrorStateMatcher } from 'src/app/core/pipe/cmsFormsErrorStateMatcher';
import { ComponentActionEnum } from 'src/app/core/helpers/model/component-action-enum';


@Component({
  selector: 'app-ticketing-template-add',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class TicketingTemplateEditComponent implements OnInit {
  requestId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TicketingTemplateEditComponent>,
    private changeDetectorRef: ChangeDetectorRef,
    private publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    public ticketingTemplateService: TicketingTemplateService,
    private cmsToastrService: CmsToastrService
  ) {
    if (data) {
      this.requestId = +data.id || 0;
    }

    this.fileManagerTree = new TreeModel();
  }
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];

  fileManagerTree: TreeModel;
  appLanguage = 'fa';
  formMatcher = new CmsFormsErrorStateMatcher();

  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<TicketingTemplateModel> = new ErrorExceptionResult<TicketingTemplateModel>();
  dataModel: TicketingTemplateModel = new TicketingTemplateModel();
  dataFileModel = new Map<number, string>();
  @ViewChild('vform', { static: false }) formGroup: FormGroup;

  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();

  ngOnInit(): void {
    if (this.requestId > 0) {
      this.formInfo.FormTitle = 'ویرایش  دسته بندی';
      this.DataGetOneContent();
    } else {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }


    this.getEnumRecordStatus();
  }

  getEnumRecordStatus(): void {
    this.loading.display = true;
    this.coreEnumService.ServiceEnumRecordStatus().subscribe((res) => {
      this.dataModelEnumRecordStatusResult = res;
      this.loading.display = false;
    });
  }

  DataGetOneContent(): void {
    if (this.requestId <= 0) {
      this.cmsToastrService.typeErrorEditRowIsNull();
      return;
    }

    this.formInfo.FormAlert = 'در دریافت ارسال اطلاعات از سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;
    this.ticketingTemplateService.ServiceGetOneById(this.requestId).subscribe(
      (next) => {
        this.dataModel = next.Item;
        if (next.IsSuccess) {
          this.formInfo.FormTitle = this.formInfo.FormTitle + ' ' + next.Item.Title;
          this.formInfo.FormAlert = '';
          
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = next.ErrorMessage;
        }
        this.loading.display = false;
      },
      (error) => {
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

    this.DataEditContent();


  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}