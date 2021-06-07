import {
  CoreEnumService,
  EnumModel,
  ErrorExceptionResult,
  FormInfoModel,
  WebDesignerMainPageDependencyService,
  WebDesignerMainPageDependencyModel,
  DataFieldInfoModel,
  CoreModuleModel,
  WebDesignerPageAutoAddDtoModel,
  WebDesignerMainPageModel,
  WebDesignerMainPageService,
  WebDesignerMainPageTemplateModel,
  ErrorExceptionResultBase,
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
  NodeInterface,
  TreeModel,
} from 'ntk-cms-filemanager';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';

@Component({
  selector: 'app-webdesigner-pagedependency-autoaddpage',
  templateUrl: './auto-add-page.component.html',
  styleUrls: ['./auto-add-page.component.scss'],
})
export class WebDesignerMainPageDependencyAutoAddPageComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cmsStoreService: CmsStoreService,
    private dialogRef: MatDialogRef<WebDesignerMainPageDependencyAutoAddPageComponent>,
    public coreEnumService: CoreEnumService,
    public webDesignerMainPageService: WebDesignerMainPageService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
  ) {
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];

  fileManagerTree: TreeModel;
  appLanguage = 'fa';

  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResultBase = new ErrorExceptionResultBase();
  dataModel: WebDesignerPageAutoAddDtoModel = new WebDesignerPageAutoAddDtoModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  fileManagerOpenForm = false;
  storeSnapshot = this.cmsStoreService.getStateSnapshot();


  ngOnInit(): void {
    this.formInfo.FormTitle = 'اضافه کردن خود کار کلیه صفحات  ';
    this.getEnumRecordStatus();
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
    this.webDesignerMainPageService.ServiceAutoAdd(this.dataModel).subscribe(
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
  onActionSelectModule(model: WebDesignerMainPageTemplateModel | null): void {
    if (!model || model.Id.length <= 0) {
      this.cmsToastrService.typeErrorMessage(
        'قالب را مشخص کنید',
        'قالب اطلاعات مشخص نیست'
      );
      return;
    }
    this.dataModel.LinkPageTemplateGuId = model.Id;
  }
  onActionSelectParent(model: WebDesignerMainPageModel): void {
    this.dataModel.LinkPageParentGuId = '';
    if (model && model.Id && model.Id.length > 0) {
      this.dataModel.LinkPageParentGuId = model.Id;
    }
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.FormSubmitAllow = false;
    if (!this.dataModel.LinkPageTemplateGuId || this.dataModel.LinkPageTemplateGuId.length <= 0) {
      this.cmsToastrService.typeErrorMessage(
        'قالب را مشخص کنید',
        'قالب اطلاعات مشخص نیست'
      );
      return;
    }
    this.DataAddContent();


  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
