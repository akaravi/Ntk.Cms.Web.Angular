import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AccessModel, ApplicationEnumService,
  ApplicationAppModel,
  ApplicationAppService,
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
import { retry } from 'rxjs/operators';
import { ApplicationThemeConfigModel } from 'ntk-cms-api';

@Component({
  selector: 'app-aplication-app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class ApplicationAppEditComponent implements OnInit {
  requestId = 0;

  constructor(private activatedRoute: ActivatedRoute,
              public publicHelper: PublicHelper,
              public coreEnumService: CoreEnumService,
              public applicationEnumService: ApplicationEnumService,
              private applicationAppService: ApplicationAppService,
              private toasterService: CmsToastrService,
              private router: Router) {
    this.fileManagerTree = new TreeModel();
  }

  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  loading = new ProgressSpinnerModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataAccessModel: AccessModel;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  dataModel = new ApplicationAppModel();
  dataModelResult: ErrorExceptionResult<ApplicationAppModel> = new ErrorExceptionResult<ApplicationAppModel>();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  dataModelEnumOsTypeResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
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
    this.getEnumOsType();
  }
  getEnumRecordStatus(): void {
    this.coreEnumService.ServiceEnumRecordStatus().subscribe((res) => {
      this.dataModelEnumRecordStatusResult = res;
    });
  }
  getEnumOsType(): void {
    this.applicationEnumService.ServiceEnumOSType().subscribe((res) => {
      this.dataModelEnumOsTypeResult = res;
    });
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      this.toasterService.typeErrorFormInvalid();
      return;
    }
    this.DataEditContent();
  }

  DataGetAccess(): void {
    this.applicationAppService
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

    this.applicationAppService
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

    this.applicationAppService
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

  onStepClick(event: StepperSelectionEvent, stepper: MatStepper): void {
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
    this.router.navigate(['/application/source/']);
  }
  onActionFileSelectedLinkMainImageId(model: NodeInterface): void {
    this.dataModel.LinkMainImageId = model.id;
    this.dataModel.LinkMainImageIdSrc = model.downloadLinksrc;
  }
  onActionSelectSource(model: ApplicationSourceModel | null): void {
    if (!model || model.Id <= 0) {
      this.toasterService.toastr.error(
        'سورس را مشخص کنید',
        'سورس اپلیکیشن اطلاعات مشخص نیست'
      );
      return;
    }
    this.dataModel.LinkSourceId = model.Id;
  }
  onActionSelectTheme(model: ApplicationThemeConfigModel | null): void {
    if (!model || model.Id <= 0) {
      this.toasterService.toastr.error(
        'قالب را مشخص کنید',
        'قالب اپلیکیشن اطلاعات مشخص نیست'
      );
      return;
    }
    this.dataModel.LinkSourceId = model.Id;
  }
}
