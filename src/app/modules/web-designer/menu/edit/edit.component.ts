import {
  CoreEnumService,
  EnumModel,
  ErrorExceptionResult,
  FormInfoModel,
  WebDesignerMainMenuService,
  WebDesignerMainMenuModel,
  AccessModel,
  DataFieldInfoModel,
  CoreModuleModel,
  CoreUserGroupModel,
  FilterModel,
  FilterDataModel
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
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-webdesigner-menu-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class WebDesignerMainMenuEditComponent implements OnInit {
  requestId = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cmsStoreService: CmsStoreService,
    private dialogRef: MatDialogRef<WebDesignerMainMenuEditComponent>,
    public coreEnumService: CoreEnumService,
    public webDesignerMainMenuService: WebDesignerMainMenuService,
    private publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
  ) {
    if (data) {
      this.requestId = data.id + '';
    }

  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();


  appLanguage = 'fa';

  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<WebDesignerMainMenuModel> = new ErrorExceptionResult<WebDesignerMainMenuModel>();
  dataModel: WebDesignerMainMenuModel = new WebDesignerMainMenuModel();

  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  dataModelEnumMenuPlaceTypeResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  dataAccessModel: AccessModel;

  fileManagerOpenForm = false;
  storeSnapshot = this.cmsStoreService.getStateSnapshot();
  dataWebDesignerMainMenuModel: CoreUserGroupModel[];
  dataWebDesignerMainMenuIds: number[] = [];

  ngOnInit(): void {
    if (this.requestId.length > 0) {
      this.formInfo.FormTitle = 'ویرایش  ';
      this.DataGetOneContent();
    } else {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }

    this.getEnumRecordStatus();
    this.getEnumMenuPlaceType();
  }
  getEnumMenuPlaceType(): void {
    this.coreEnumService.ServiceEnumMenuPlaceType().subscribe((next) => {
      this.dataModelEnumMenuPlaceTypeResult = next;
    });
  }
  getEnumRecordStatus(): void {
    if (this.storeSnapshot
      && this.storeSnapshot.EnumRecordStatus
      && this.storeSnapshot.EnumRecordStatus
      && this.storeSnapshot.EnumRecordStatus.IsSuccess
      && this.storeSnapshot.EnumRecordStatus.ListItems
      && this.storeSnapshot.EnumRecordStatus.ListItems.length > 0) {
      this.dataModelEnumRecordStatusResult = this.storeSnapshot.EnumRecordStatus;
    }
  }
  DataGetOneContent(): void {

    this.formInfo.FormAlert = 'در دریافت ارسال اطلاعات از سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;
    /*َAccess Field*/
    this.webDesignerMainMenuService.setAccessLoad();
    this.webDesignerMainMenuService.ServiceGetOneById(this.requestId).subscribe(
      (next) => {
        /*َAccess Field*/
        this.dataAccessModel = next.Access;
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);
        this.dataModel = next.Item;
        if (next.IsSuccess) {
          this.formInfo.FormTitle = this.formInfo.FormTitle + ' ' + next.Item.Title;
          this.formInfo.FormAlert = '';
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = next.ErrorMessage;
          this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
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
    this.webDesignerMainMenuService.ServiceEdit(this.dataModel).subscribe(
      (next) => {
        this.formInfo.FormSubmitAllow = true;
        this.dataModelResult = next;
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
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
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

  onActionSelectorSelect(model: WebDesignerMainMenuModel): void {
    this.dataModel.LinkParentId = null;
    if (model && model.Id.length > 0) {
      this.dataModel.LinkParentId = model.Id;
    }
  }
  onActionSelectorUserCategorySelect(model: CoreUserGroupModel[]): void {
    this.dataWebDesignerMainMenuModel = model;
  }
  onIconPickerSelect(model: any): void {
    this.dataModel.Icon = model;
  }

}
