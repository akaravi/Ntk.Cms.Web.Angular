import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AccessModel, ApplicationEnumService,
  ApplicationIntroModel,
  ApplicationIntroService,
  CoreEnumService,
  DataFieldInfoModel,
  EnumModel,
  ErrorExceptionResult,
  FormInfoModel,
  ApplicationSourceModel,
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import { CmsStoreService } from 'src/app/core/reducers/cmsStoreService';


@Component({
  selector: 'app-aplication-intro-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class ApplicationIntroEditComponent implements OnInit {
  requestId = 0;

  constructor(private activatedRoute: ActivatedRoute,
    private cmsStoreService: CmsStoreService,
    public publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    public applicationEnumService: ApplicationEnumService,
    private applicationIntroService: ApplicationIntroService,
    private toasterService: CmsToastrService,
    private router: Router) {
    this.fileManagerTree = new TreeModel();
  }

  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  loading = new ProgressSpinnerModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataAccessModel: AccessModel;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  dataModel = new ApplicationIntroModel();
  dataModelResult: ErrorExceptionResult<ApplicationIntroModel> = new ErrorExceptionResult<ApplicationIntroModel>();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  dataModelEnumOsTypeResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  selectFileTypeMainVideo = ['mp4'];
  fileManagerOpenForm = false;
  appLanguage = 'fa';

  fileManagerTree: TreeModel;

  ngOnInit(): void {
    this.requestId = Number(this.activatedRoute.snapshot.paramMap.get('Id'));
    if (this.requestId === 0) {
      this.toasterService.typeErrorAddRowParentIsNull();
      return;
    }
    this.DataGetAccess();
    this.DataGetOne(this.requestId);
    this.getEnumRecordStatus();
  }
  storeSnapshot = this.cmsStoreService.getStateSnapshot();
  getEnumRecordStatus(): void {
    if (this.storeSnapshot && this.storeSnapshot.EnumRecordStatus && this.storeSnapshot.EnumRecordStatus && this.storeSnapshot.EnumRecordStatus.IsSuccess && this.storeSnapshot.EnumRecordStatus.ListItems && this.storeSnapshot.EnumRecordStatus.ListItems.length > 0) {
      this.dataModelEnumRecordStatusResult = this.storeSnapshot.EnumRecordStatus;
    }
  }

  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      this.toasterService.typeErrorFormInvalid();
      return;
    }
    if (this.dataModel.LinkApplicationId <= 0) {
      this.toasterService.typeErrorEdit('  برنامه مشخص  کنید');

      return;
    }

    this.DataEditContent();
  }

  DataGetAccess(): void {
    this.applicationIntroService
      .ServiceViewModel()
      .subscribe(
        async (next) => {
          if (next.IsSuccess) {
            this.dataAccessModel = next.Access;
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
  DataGetOne(requestId: number): void {
    this.formInfo.FormAllowSubmit = false;
    this.formInfo.FormAlert = 'در حال دریافت اطلاعات از سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;

    this.applicationIntroService
      .ServiceGetOneById(requestId)
      .subscribe(
        async (next) => {
          this.loading.display = false;
          this.dataModelResult = next;
          this.formInfo.FormAllowSubmit = true;

          if (next.IsSuccess) {
            this.dataModel = next.Item;
          } else {
            this.toasterService.typeErrorGetOne(next.ErrorMessage);
          }
        },
        (error) => {
          this.loading.display = false;
          this.formInfo.FormAllowSubmit = true;
          this.toasterService.typeErrorGetOne(error);
        }
      );
  }
  DataEditContent(): void {
    this.formInfo.FormAllowSubmit = false;
    this.formInfo.FormAlert = 'در حال ارسال اطلاعات به سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;

    this.applicationIntroService
      .ServiceEdit(this.dataModel)
      .subscribe(
        async (next) => {
          this.loading.display = false;
          this.formInfo.FormAllowSubmit = !next.IsSuccess;
          this.dataModelResult = next;
          if (next.IsSuccess) {
            this.formInfo.FormAlert = 'ثبت با موفقیت انجام شد';
            this.toasterService.typeSuccessEdit();
            this.router.navigate(['/application/source/']);
          } else {
            this.toasterService.typeErrorEdit(next.ErrorMessage);
          }
        },
        (error) => {
          this.loading.display = false;
          this.formInfo.FormAllowSubmit = true;
          this.toasterService.typeErrorEdit(error);
        }
      );
  }

  onStepClick(event: StepperSelectionEvent): void {
    if (event.previouslySelectedIndex < event.selectedIndex) {
      // if (!this.formGroup.valid) {
      //   this.toasterService.typeErrorFormInvalid();
      //   setTimeout(() => {
      //     stepper.selectedIndex = event.previouslySelectedIndex;
      //     // stepper.previous();
      //   }, 10);
      // }
    }
  }

  onActionBackToParent(): void {
    this.router.navigate(['/application/app/']);
  }
  onActionFileSelectedLinkMainImageId(model: NodeInterface): void {
    this.dataModel.LinkMainImageId = model.id;
    this.dataModel.LinkMainImageIdSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkMainVideoId(model: NodeInterface): void {
    this.dataModel.LinkMainVideoId = model.id;
    this.dataModel.LinkMainVideoIdSrc = model.downloadLinksrc;
  }
  onActionSelectApplication(model: ApplicationSourceModel | null): void {
    if (!model || model.Id <= 0) {
      this.toasterService.toastr.error(
        'اپلیکیشن را مشخص کنید',
        ' اپلیکیشن اطلاعات مشخص نیست'
      );
      return;
    }
    this.dataModel.LinkApplicationId = model.Id;
  }

}
