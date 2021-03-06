import {
  CoreEnumService,
  EnumModel,
  ErrorExceptionResult,
  FormInfoModel,
  CoreUserClaimGroupService,
  CoreUserClaimGroupModel,
  DataFieldInfoModel,
  CoreSiteCategoryModel,
  CoreUserGroupModel,
  ApplicationAppModel,
  CoreModuleModel,
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
import {
  TreeModel,
} from 'ntk-cms-filemanager';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';

@Component({
  selector: 'app-core-userclaimgroup-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class CoreUserClaimGroupAddComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cmsStoreService: CmsStoreService,
    private dialogRef: MatDialogRef<CoreUserClaimGroupAddComponent>,
    public coreEnumService: CoreEnumService,
    public coreUserClaimGroupService: CoreUserClaimGroupService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService
  ) {
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];

  fileManagerTree: TreeModel;
  appLanguage = 'fa';

  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<CoreUserClaimGroupModel> = new ErrorExceptionResult<CoreUserClaimGroupModel>();
  dataModel: CoreUserClaimGroupModel = new CoreUserClaimGroupModel();


  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  dataModelEnumUserClaimGroupActionTypeResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();

  fileManagerOpenForm = false;

  storeSnapshot = this.cmsStoreService.getStateSnapshot();


  ngOnInit(): void {

    this.formInfo.FormTitle = 'اضافه کردن  ';
    this.getEnumRecordStatus();
    this.DataGetAccess();
    this.getEnumUserClaimGroupActionType();
  }
  getEnumUserClaimGroupActionType(): void {
    this.coreEnumService.ServiceEnumUserClaimGroupActionType().subscribe((next) => {
      this.dataModelEnumUserClaimGroupActionTypeResult = next;
    });
  }

  DataGetAccess(): void {
    this.coreUserClaimGroupService
      .ServiceViewModel()
      .subscribe(
        async (next) => {
          if (next.IsSuccess) {
            // this.dataAccessModel = next.Access;
            this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);
          } else {
            this.cmsToastrService.typeErrorGetAccess(next.ErrorMessage);
          }
        },
        (error) => {
          this.cmsToastrService.typeErrorGetAccess(error);
        }
      );
  }
  getEnumRecordStatus(): void {
    if (this.storeSnapshot &&
      this.storeSnapshot.EnumRecordStatus &&
      this.storeSnapshot.EnumRecordStatus &&
      this.storeSnapshot.EnumRecordStatus.IsSuccess &&
      this.storeSnapshot.EnumRecordStatus.ListItems &&
      this.storeSnapshot.EnumRecordStatus.ListItems.length > 0) {
      this.dataModelEnumRecordStatusResult = this.storeSnapshot.EnumRecordStatus;
    }
  }


  DataAddContent(): void {
    this.formInfo.FormAlert = 'در حال ارسال اطلاعات به سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;
    this.coreUserClaimGroupService.ServiceAdd(this.dataModel).subscribe(
      (next) => {
        this.formInfo.FormSubmitAllow = true;
        this.dataModelResult = next;
        if (next.IsSuccess) {
          this.formInfo.FormAlert = 'ثبت با موفقیت انجام شد';
          this.cmsToastrService.typeSuccessAdd();
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
  onActionSelectApplication(model: ApplicationAppModel | null): void {
    if (!model || model.Id <= 0) {
      this.dataModel.LinkApplicationId = null;
      return;
    }
    this.dataModel.LinkApplicationId = model.Id;
  }
  onActionSelectSiteCategory(model: CoreSiteCategoryModel | null): void {
    if (!model || model.Id <= 0) {
      this.dataModel.LinkSiteCategoryId = null;
      return;
    }
    this.dataModel.LinkSiteCategoryId = model.Id;
  }
  onActionSelectModuleId(model: CoreModuleModel | null): void {
    if (!model || model.Id <= 0) {
      const message = 'ماژول مشخص نیست';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.dataModel.LinkSiteCategoryId = model.Id;
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.FormSubmitAllow = false;

    this.DataAddContent();


  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
