import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AccessModel, ApplicationEnumService,
  ApplicationSourceModel,
  ApplicationSourceService,
  ApplicationSourceSiteCategoryModel,
  ApplicationSourceSiteCategoryService,
  CoreEnumService,
  CoreSiteCategoryModel,
  DataFieldInfoModel,
  EnumModel,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  FormInfoModel,
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import { retry } from 'rxjs/operators';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';

@Component({
  selector: 'app-aplication-source-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class ApplicationSourceEditComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private cmsStoreService: CmsStoreService,
    public publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    public applicationEnumService: ApplicationEnumService,
    private applicationSourceService: ApplicationSourceService,
    private applicationSourceSiteCategoryService: ApplicationSourceSiteCategoryService,
    private cmsToastrService: CmsToastrService,
    private router: Router) {
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  requestId = 0;

  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  loading = new ProgressSpinnerModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataAccessModel: AccessModel;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  dataModel = new ApplicationSourceModel();
  dataModelResult: ErrorExceptionResult<ApplicationSourceModel> = new ErrorExceptionResult<ApplicationSourceModel>();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  dataModelEnumOsTypeResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerOpenForm = false;
  appLanguage = 'fa';

  fileManagerTree: TreeModel;
  storeSnapshot = this.cmsStoreService.getStateSnapshot();
  dataCoreSiteCategoryModel: CoreSiteCategoryModel[];
  dataCoreSiteCategoryIds: number[] = [];
  dataApplicationSourceSiteCategoryModel: ApplicationSourceSiteCategoryModel[];
  ngOnInit(): void {
    this.requestId = + Number(this.activatedRoute.snapshot.paramMap.get('Id'));
    if (this.requestId === 0) {
      this.cmsToastrService.typeErrorAddRowParentIsNull();
      return;
    }
    this.DataGetOne(this.requestId);
    this.DataGetAllSourceSiteCategory();
    this.getEnumRecordStatus();
    this.getEnumOsType();
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
  getEnumOsType(): void {
    this.applicationEnumService.ServiceEnumOSType().subscribe((res) => {
      this.dataModelEnumOsTypeResult = res;
    });
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      this.cmsToastrService.typeErrorFormInvalid();
      return;
    }
    this.DataEditContent();
  }


  DataGetOne(requestId: number): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = 'در حال دریافت اطلاعات از سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;
    /*َAccess Field*/
    this.applicationSourceService.setAccessLoad();
    this.applicationSourceService
      .ServiceGetOneById(requestId)
      .subscribe(
        async (next) => {
          /*َAccess Field*/
          this.dataAccessModel = next.Access;
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);
          this.loading.display = false;
          this.dataModelResult = next;
          this.formInfo.FormSubmitAllow = true;

          if (next.IsSuccess) {
            this.dataModel = next.Item;
          } else {
            this.cmsToastrService.typeErrorGetOne(next.ErrorMessage);
          }
        },
        (error) => {
          this.loading.display = false;
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(error);
        }
      );
  }
  DataGetAllSourceSiteCategory(): void {
    this.formInfo.FormAlert = 'در دریافت ارسال اطلاعات از سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;
    const filteModelContent = new FilterModel();
    const filter = new FilterDataModel();
    filter.PropertyName = 'LinkSourceId';
    filter.Value = this.requestId;
    filteModelContent.Filters.push(filter);

    this.applicationSourceSiteCategoryService.ServiceGetAll(filteModelContent).subscribe(
      (next) => {
         this.dataApplicationSourceSiteCategoryModel = next.ListItems;
        const listG: number[] = [];
        this.dataApplicationSourceSiteCategoryModel.forEach(element => {
          listG.push(element.LinkSiteCagegoryId);
        });
        this.dataCoreSiteCategoryIds = listG;
        if (next.IsSuccess) {
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
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = 'در حال ارسال اطلاعات به سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;

    this.applicationSourceService
      .ServiceEdit(this.dataModel)
      .subscribe(
        async (next) => {
          this.loading.display = false;
          this.formInfo.FormSubmitAllow = !next.IsSuccess;
          this.dataModelResult = next;
          if (next.IsSuccess) {
            this.formInfo.FormAlert = 'ثبت با موفقیت انجام شد';
            this.cmsToastrService.typeSuccessEdit();
            setTimeout(() => this.router.navigate(['/application/source/']), 100);
          } else {
            this.cmsToastrService.typeErrorEdit(next.ErrorMessage);
          }
        },
        (error) => {
          this.loading.display = false;
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorEdit(error);
        }
      );
  }


  onActionSelectorUserCategorySelect(model: CoreSiteCategoryModel[]): void {
    this.dataCoreSiteCategoryModel = model;
  }
  onActionSelectorUserCategorySelectAdded(model: CoreSiteCategoryModel): void {
    const entity = new ApplicationSourceSiteCategoryModel();
    entity.LinkSiteCagegoryId = model.Id;
    entity.LinkSourceId = this.dataModel.Id;

    this.applicationSourceSiteCategoryService.ServiceAdd(entity).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.formInfo.FormAlert = 'ثبت در این گروه با موفقیت انجام شد';
          this.cmsToastrService.typeSuccessEdit();
          // this.dialogRef.close({ dialogChangedDate: true });
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = next.ErrorMessage;
          this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
        }

      },
      (error) => {
        this.formInfo.FormSubmitAllow = true;
        this.cmsToastrService.typeError(error);

      }
    );
  }
  onActionSelectorUserCategorySelectRemoved(model: CoreSiteCategoryModel): void {
    const entity = new ApplicationSourceSiteCategoryModel();
    entity.LinkSiteCagegoryId = model.Id;
    entity.LinkSourceId = this.dataModel.Id;

    this.applicationSourceSiteCategoryService.ServiceDeleteEntity(entity).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.formInfo.FormAlert = 'حذف از این گروه با موفقیت انجام شد';
          this.cmsToastrService.typeSuccessEdit();
          // this.dialogRef.close({ dialogChangedDate: true });
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = next.ErrorMessage;
          this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
        }
      },
      (error) => {
        this.formInfo.FormSubmitAllow = true;
        this.cmsToastrService.typeError(error);
      }
    );
  }
  onStepClick(event: StepperSelectionEvent, stepper: MatStepper): void {
    if (event.previouslySelectedIndex < event.selectedIndex) {
      // if (!this.formGroup.valid) {
      //   this.cmsToastrService.typeErrorFormInvalid();
      //   setTimeout(() => {
      //     stepper.selectedIndex = event.previouslySelectedIndex;
      //     // stepper.previous();
      //   }, 10);
      // }
    }
  }
  onActionBackToParent(): void {
    this.router.navigate(['/application/source/']);
  }
  onActionFileSelectedLinkMainImageId(model: NodeInterface): void {
    this.dataModel.LinkMainImageId = model.id;
    this.dataModel.LinkMainImageIdSrc = model.downloadLinksrc;
  }
}
