import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AccessModel,
  TicketingAnswerModel,
  TicketingAnswerService,
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
import { TreeModel } from 'ntk-cms-filemanager';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';


@Component({
  selector: 'app-ticketing-answer-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class TicketingAnswerEditComponent implements OnInit {
  requestId = 0;
  constructor(
    private activatedRoute: ActivatedRoute,
    private cmsStoreService: CmsStoreService,
    public publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    private ticketingAnswerService: TicketingAnswerService,
    private cmsToastrService: CmsToastrService,
    private router: Router) {
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  loading = new ProgressSpinnerModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataAccessModel: AccessModel;
  dataModel = new TicketingAnswerModel();
  dataModelResult: ErrorExceptionResult<TicketingAnswerModel> = new ErrorExceptionResult<TicketingAnswerModel>();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  dataModelEnumOsTypeResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerOpenForm = false;
  appLanguage = 'fa';

  fileManagerTree: TreeModel;
  mapMarker: any;
  mapOptonCenter = {};
  storeSnapshot = this.cmsStoreService.getStateSnapshot();
  ngOnInit(): void {
    this.requestId = + Number(this.activatedRoute.snapshot.paramMap.get('Id'));
    if (this.requestId === 0) {
      this.cmsToastrService.typeErrorAddRowParentIsNull();
      return;
    }
    this.DataGetOne(this.requestId);
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
    this.ticketingAnswerService.setAccessLoad();
    this.ticketingAnswerService
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
  DataEditContent(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = 'در حال ارسال اطلاعات به سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;

    this.ticketingAnswerService
      .ServiceEdit(this.dataModel)
      .subscribe(
        async (next) => {
          this.loading.display = false;
          this.formInfo.FormSubmitAllow = !next.IsSuccess;
          this.dataModelResult = next;
          if (next.IsSuccess) {
            this.formInfo.FormAlert = 'ثبت با موفقیت انجام شد';
            this.cmsToastrService.typeSuccessEdit();
            setTimeout(() => this.router.navigate(['/application/app/']), 100);
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

  onStepClick(event: StepperSelectionEvent, stepper: any): void {
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
    this.router.navigate(['/application/app/']);
  }
  onActionFileSelectedLinkMainImageId(): void {
    // this.dataModel.LinkMainImageId = model.id;
    // this.dataModel.LinkMainImageIdSrc = model.downloadLinksrc;
  }

  onActionSelectSource(model: ApplicationSourceModel | null): void {
    if (!model || model.Id <= 0) {
      this.cmsToastrService.typeErrorMessage(
        'سورس را مشخص کنید',
        'سورس اپلیکیشن اطلاعات مشخص نیست'
      );
      return;
    }


  }

}
