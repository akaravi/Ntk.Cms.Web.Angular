import {
  CoreEnumService,
  EnumModel,
  ErrorExceptionResult,
  FormInfoModel,
  CoreSiteService,
  CoreSiteModel,
  CoreModuleSiteModel,
  CoreModuleSiteService,
  CoreModuleModel,
  AccessModel,
  DataFieldInfoModel,
} from 'ntk-cms-api';
import {
  Component,
  OnInit,
  ViewChild,
  Inject,
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

@Component({
  selector: 'app-core-site-module-add',
  templateUrl: './moduleAdd.component.html',
  styleUrls: ['./moduleAdd.component.scss'],
})
export class CoreSiteModuleAddComponent implements OnInit {
  requestLinkSiteId = 0;
  requestLinkModuleId = 0;
    constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cmsStoreService: CmsStoreService,
    private dialogRef: MatDialogRef<CoreSiteModuleAddComponent>,
    public coreEnumService: CoreEnumService,
    public coreSiteService: CoreModuleSiteService,
    private cmsToastrService: CmsToastrService,
    private publicHelper: PublicHelper,
  ) {
    if (data) {
      this.requestLinkModuleId = +data.LinkModuleId || 0;
      this.requestLinkSiteId = +data.LinkSiteId || 0;
    }
    if (this.requestLinkSiteId > 0) {
      this.dataModel.LinkSiteId = this.requestLinkSiteId;
    }
    if (this.requestLinkModuleId > 0) {
      this.dataModel.LinkModuleId = this.requestLinkModuleId;
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();


  dataAccessModel: AccessModel;


  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<CoreModuleSiteModel> = new ErrorExceptionResult<CoreModuleSiteModel>();
  dataModel: CoreModuleSiteModel = new CoreModuleSiteModel();

  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();

  fileManagerOpenForm = false;
  storeSnapshot = this.cmsStoreService.getStateSnapshot();

  ngOnInit(): void {
    this.getEnumRecordStatus();
    this.DataGetAccess();
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

  DataGetAccess(): void {
    this.coreSiteService
      .ServiceViewModel()
      .subscribe(
        async (next) => {
          if (next.IsSuccess) {
            this.dataAccessModel = next.Access;
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

  DataAddContent(): void {
    this.formInfo.FormAlert = 'در حال ارسال اطلاعات به سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;
    this.coreSiteService.ServiceAdd(this.dataModel).subscribe(
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
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.FormSubmitAllow = false;
    this.DataAddContent();
  }
  onActionSiteSelect(model: CoreSiteModel): void {
    this.dataModel.LinkSiteId = null;
    if (model && model.Id > 0) {
      this.dataModel.LinkSiteId = model.Id;
    }
  }
  onActionSelectorModuleSelect(model: CoreModuleModel): void {
    if (!model || model.Id <= 0) {
      const message = 'ماژول مشخص نیست';
      this.cmsToastrService.typeErrorSelected(message);
    }
    this.dataModel.LinkModuleId = model.Id;

  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
