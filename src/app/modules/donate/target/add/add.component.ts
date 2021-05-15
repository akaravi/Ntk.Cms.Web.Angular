import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as Leaflet from 'leaflet';
import { FormGroup } from '@angular/forms';
import {
  CoreEnumService,
  EnumModel,
  ErrorExceptionResult,
  FilterModel,
  FormInfoModel,
  DonateTargetModel,
  DonateTargetService,
  FilterDataModel,
  PollingCategoryModel,
  DataFieldInfoModel,
  AccessModel,
  PollingOptionModel,
  PollingOptionService,
} from 'ntk-cms-api';
import { ActivatedRoute, Router } from '@angular/router';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import { Map as leafletMap } from 'leaflet';


import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { PoinModel } from 'src/app/core/models/pointModel';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';

@Component({
  selector: 'app-polling-content-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'
  ]
})
export class DonateTargetAddComponent implements OnInit, AfterViewInit {
  requestCategoryId = 0;
  constructor(
    private activatedRoute: ActivatedRoute,
    private cmsStoreService: CmsStoreService,
    public coreEnumService: CoreEnumService,
    public publicHelper: PublicHelper,
    private donateTargetService: DonateTargetService,
    private pollingOptionService: PollingOptionService,

    private cmsToastrService: CmsToastrService,
    private router: Router,

  ) {
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  dataModel = new DonateTargetModel();
  dataAccessModel: AccessModel;
  dataModelResult: ErrorExceptionResult<DonateTargetModel> = new ErrorExceptionResult<DonateTargetModel>();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  optionSelected: PollingOptionModel = new PollingOptionModel();
  optionDataModel = new Array<PollingOptionModel>();
  optionTabledataSource = new MatTableDataSource<PollingOptionModel>();
  dataOptionModelResult: ErrorExceptionResult<PollingOptionModel> = new ErrorExceptionResult<PollingOptionModel>();
  optionActionTitle = 'اضافه به لیست';
  optionActionButtomEnable = true;
  optionTabledisplayedColumns = ['Id', 'Option', 'OptionAnswer', 'IsCorrectAnswer', 'NumberOfVotes', 'ScoreOfVotes', 'Action'];

  loading = new ProgressSpinnerModel();
  loadingOption = new ProgressSpinnerModel();
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  selectFileTypePodcast = ['mp3'];
  selectFileTypeMovie = ['mp4'];
  formInfo: FormInfoModel = new FormInfoModel();
  fileManagerOpenForm = false;
  fileManagerOpenFormPodcast = false;
  fileManagerOpenFormMovie = false;
  fileManagerTree: TreeModel;
  tagIdsData: number[];


  appLanguage = 'fa';

  viewMap = false;
  mapMarker: any;
  private mapModel: leafletMap;
  private mapMarkerPoints: Array<PoinModel> = [];
  mapOptonCenter = {};

  storeSnapshot = this.cmsStoreService.getStateSnapshot();
  ngOnInit(): void {
    this.requestCategoryId = + Number(this.activatedRoute.snapshot.paramMap.get('CategoryId'));
    if (this.requestCategoryId === 0) {
      this.cmsToastrService.typeErrorAddRowParentIsNull();
      return;
    }
    this.dataModel.LinkTargetCategoryId = this.requestCategoryId;

    this.DataGetAccess();
    this.getEnumRecordStatus();
  }
  ngAfterViewInit(): void {

  }
  onActionFileSelectedLinkMainImageId(model: NodeInterface): void {
    this.dataModel.LinkMainImageId = model.id;
    this.dataModel.LinkMainImageIdSrc = model.downloadLinksrc;
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
    if (this.requestCategoryId <= 0) {
      this.cmsToastrService.typeErrorAddRowParentIsNull();
      return;
    }
    if (!this.formGroup.valid) {
      this.cmsToastrService.typeErrorFormInvalid();
      return;
    }

    this.DataEditContent();


  }
  DataGetAccess(): void {
    this.donateTargetService
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
  DataGetOne(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = 'در حال دریافت اطلاعات از سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;

    this.donateTargetService
      .ServiceGetOneById(this.dataModelResult.Item.Id)
      .subscribe(
        async (next) => {
          this.loading.display = false;
          this.dataModelResult = next;
          this.formInfo.FormSubmitAllow = true;

          if (next.IsSuccess) {
            this.dataModel = next.Item;

            this.DataOptionGetAll();
            // this.DataOtherInfoGetAll();
            // this.DataSimilarGetAllIds();
            this.loading.display = false;
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
  DataOptionGetAll(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = 'در حال دریافت گزینه ها از سرور';
    this.formInfo.FormError = '';
    this.loadingOption.display = true;


    const filteModel = new FilterModel();

    const filter = new FilterDataModel();
    filter.PropertyName = 'LinkDonateTargetId';
    filter.Value = this.dataModelResult.Item.Id;
    filteModel.Filters.push(filter);
    this.pollingOptionService
      .ServiceGetAll(filteModel)
      .subscribe(
        async (next) => {
          this.loadingOption.display = false;
          this.formInfo.FormSubmitAllow = true;
          this.dataOptionModelResult = next;
          if (next.IsSuccess) {
            this.optionDataModel = next.ListItems;
            this.optionTabledataSource.data = next.ListItems;
          } else {
            this.cmsToastrService.typeErrorGetAll(next.ErrorMessage);
          }
        },
        (error) => {
          this.loadingOption.display = false;
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetAll(error);
        }
      );
  }


  DataAddContent(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = 'در حال ارسال اطلاعات به سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;

    this.donateTargetService
      .ServiceAdd(this.dataModel)
      .subscribe(
        async (next) => {
          this.loading.display = false;
          this.dataModelResult = next;
          if (next.IsSuccess) {
            this.cmsToastrService.typeSuccessAdd();
            this.dataModel = next.Item;
          } else {
            this.cmsToastrService.typeErrorAdd(next.ErrorMessage);
          }
          this.formInfo.FormAlert = '';
          this.formInfo.FormSubmitAllow = true;
        },
        (error) => {
          this.loading.display = false;
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorAdd(error);
        }
      );
  }

  DataEditContent(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = 'در حال ارسال اطلاعات به سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;

    this.donateTargetService
      .ServiceEdit(this.dataModel)
      .subscribe(
        async (next) => {
          this.loading.display = false;
          this.formInfo.FormSubmitAllow = true;
          this.dataModelResult = next;
          if (next.IsSuccess) {

            this.formInfo.FormAlert = 'ثبت با موفقیت انجام شد';
            this.cmsToastrService.typeSuccessAdd();
            this.loading.display = false;
            setTimeout(() => this.router.navigate(['/polling/content']), 1000);
          } else {
            this.cmsToastrService.typeErrorAdd(next.ErrorMessage);
          }
        },
        (error) => {
          this.loading.display = false;
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorAdd(error);
        }
      );
  }
  // async DataActionAfterAddContentSuccessfullOption(model: DonateTargetModel): Promise<any> {
  //   const dataListAdd = new Array<PollingOptionModel>();
  //   const dataListDelete = new Array<PollingOptionModel>();
  //   if (this.optionDataModel) {
  //     this.optionDataModel.forEach(item => {
  //       const row = new PollingOptionModel();
  //       row.LinkDonateTargetId = model.Id;
  //       if (!this.dataOptionModelResult.ListItems || !item.Id || !this.dataOptionModelResult.ListItems.find(x => x.Id === item.Id)) {
  //         dataListAdd.push(row);
  //       }
  //     });
  //   }
  //   if (this.dataOptionModelResult.ListItems) {
  //     this.dataOptionModelResult.ListItems.forEach(item => {
  //       if (!this.optionDataModel || !this.optionDataModel.find(x => x.Id === item.Id)) {
  //         dataListDelete.push(item);
  //       }
  //     });
  //   }
  //   if (dataListAdd && dataListAdd.length > 0) {
  //   }
  //   if (dataListDelete && dataListDelete.length > 0) {
  //   }
  // }
  onActionSelectorSelect(model: PollingCategoryModel | null): void {
    if (!model || model.Id <= 0) {
      const message = 'دسته بندی اطلاعات مشخص نیست';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.dataModel.LinkTargetCategoryId = model.Id;
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
    if (!this.dataModelResult || !this.dataModelResult.Item || this.dataModelResult.Item.Id <= 0) {
      this.DataAddContent();
    }
  }
  onActionBackToParent(): void {
    this.router.navigate(['/polling/content/']);
  }
  
}
