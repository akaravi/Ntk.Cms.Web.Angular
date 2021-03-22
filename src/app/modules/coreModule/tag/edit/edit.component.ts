import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as Leaflet from 'leaflet';
import { FormGroup } from '@angular/forms';
import {
  CoreEnumService,
  EnumModel,
  ErrorExceptionResult,
  FilterModel,
  FormInfoModel,
  CoreModuleTagModel,
  CoreModuleTagService,
  FilterDataModel,
  CoreModuleTagCategoryModel,
} from 'ntk-cms-api';
import { ActivatedRoute, Router } from '@angular/router';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import { Map as leafletMap } from 'leaflet';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';

@Component({
  selector: 'app-tag-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'
  ]
})
export class CoreModuleTagEditComponent implements OnInit, AfterViewInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private cmsStoreService: CmsStoreService,
    public coreEnumService: CoreEnumService,
    public coreModuleTagService: CoreModuleTagService,
    private newsContentService: CoreModuleTagService,
    private router: Router,
    private cmsToastrService: CmsToastrService,
  ) {
    this.fileManagerTree = new TreeModel();
  }
  requestId = 0;
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  dataModel = new CoreModuleTagModel();
  dataModelResult: ErrorExceptionResult<CoreModuleTagModel> = new ErrorExceptionResult<CoreModuleTagModel>();
  datatagDataModelResult: ErrorExceptionResult<CoreModuleTagModel> = new ErrorExceptionResult<CoreModuleTagModel>();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  loading = new ProgressSpinnerModel();
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  selectFileTypePodcast = ['mp3'];
  selectFileTypeMovie = ['mp4'];
  formInfo: FormInfoModel = new FormInfoModel();
  mapMarker: any;
  fileManagerOpenForm = false;
  fileManagerOpenFormPodcast = false;
  fileManagerOpenFormMovie = false;
  fileManagerTree: TreeModel;

  appLanguage = 'fa';

  viewMap = false;
  private mapModel: leafletMap;



  storeSnapshot = this.cmsStoreService.getStateSnapshot();
  ngOnInit(): void {
    this.requestId = Number(this.activatedRoute.snapshot.paramMap.get('Id'));
    if (this.requestId === 0) {
      this.cmsToastrService.typeErrorAddRowParentIsNull();
      return;
    }
    this.DataGetOne();
    this.getEnumRecordStatus();
  }
  ngAfterViewInit(): void {
    // this.optionsCategorySelector.parentMethods = {
    //   onActionSelect: (x) => this.onActionCategorySelect(x),
    // };
    // this.optionsContentSelector.parentMethods = {
    //   onActionSelect: (x) => this.onActionContentSimilarSelect(x),
    // };
  }
  public requestAutocompleteItems = (text: string): Observable<any> => {
    const filteModel = new FilterModel();
    filteModel.RowPerPage = 20;
    filteModel.AccessLoad = true;
    if (text && typeof text === 'string' && text.length > 0) {
      const aaa = {
        PropertyName: 'Title',
        Value: text,
        SearchType: 5
      };
      filteModel.Filters.push(aaa as FilterDataModel);
    } else if (text && typeof text === 'number' && text > 0) {
      const aaa2 = {
        PropertyName: 'Title',
        Value: text + '',
        SearchType: 5,
        ClauseType: 1
      };
      filteModel.Filters.push(aaa2 as FilterDataModel);
      const aaa3 = {
        PropertyName: 'Id',
        Value: text + '',
        SearchType: 1,
        ClauseType: 1
      };
      filteModel.Filters.push(aaa3 as FilterDataModel);
    }
    return this.coreModuleTagService.ServiceGetAll(filteModel).pipe(
      map((data) => data.ListItems.map(val => ({
        value: val.Id,
        display: val.Title
      })))
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


  onFormSubmit(): void {
    if (this.requestId <= 0) {
      this.cmsToastrService.typeErrorAddRowParentIsNull();
      return;
    }
    if (!this.formGroup.valid) {
      this.cmsToastrService.typeErrorFormInvalid();
      return;
    }


    this.DataEditContent();
  }

  DataGetOne(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = 'در حال دریافت اطلاعات از سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;

    this.newsContentService
      .ServiceGetOneById(this.requestId)
      .subscribe(
        async (next) => {
          this.loading.display = false;
          this.dataModelResult = next;
          this.formInfo.FormSubmitAllow = true;

          if (next.IsSuccess) {
            this.dataModel = next.Item;
            // this.optionsCategorySelector.childMethods.ActionSelectForce(next.Item.LinkCategoryId);
            // this.cmsToastrService.typeSuccess();
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
  DataEditContent(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = 'در حال ارسال اطلاعات به سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;

    this.newsContentService
      .ServiceEdit(this.dataModel)
      .subscribe(
        async (next) => {
          this.loading.display = false;
          this.formInfo.FormSubmitAllow = true;
          this.dataModelResult = next;
          if (next.IsSuccess) {

            this.formInfo.FormAlert = 'ثبت با موفقیت انجام شد';
            this.cmsToastrService.typeSuccessAdd();
            // await this.DataActionAfterAddContentSuccessfulTag(this.dataModelResult.Item);
            // await this.DataActionAfterAddContentSuccessfulSimilar(this.dataModelResult.Item);
            // await this.DataActionAfterAddContentSuccessfulOtherInfo(this.dataModelResult.Item);
            this.loading.display = false;
            setTimeout(() => this.router.navigate(['/news/edit/', this.requestId]), 100);
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

  onActionCategorySelect(model: CoreModuleTagCategoryModel | null): void {
    if (!model || model.Id <= 0) {
      this.cmsToastrService.toastr.error(
        'دسته بندی را مشخص کنید',
        'دسته بندی اطلاعات مشخص نیست'
      );
      return;
    }
    this.dataModel.LinkCategoryId = model.Id;
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
  onActionBackToParent(): void {
    this.router.navigate(['/news/content/']);
  }

}
