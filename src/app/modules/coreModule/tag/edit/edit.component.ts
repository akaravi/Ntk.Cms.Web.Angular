import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as Leaflet from 'leaflet';
import { FormGroup } from '@angular/forms';
import {
  CoreEnumService,
  CoreModuleTagService,
  EnumModel,
  ErrorExceptionResult,
  FilterModel,
  FormInfoModel,
  NewsContentModel,
  NewsContentService,
  FilterDataModel,
  CoreModuleTagModel,
  NewsCategoryModel,
  NewsContentTagService,
  NewsContentTagModel,
  NewsContentSimilarService,
  NewsContentOtherInfoService,
  NewsContentOtherInfoModel,
  NewsContentSimilarModel
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
export class TagEditComponent implements OnInit, AfterViewInit {
  requestId = 0;
  constructor(
    private activatedRoute: ActivatedRoute,
    private cmsStoreService: CmsStoreService,
    public coreEnumService: CoreEnumService,
    public coreModuleTagService: CoreModuleTagService,
    private newsContentService: NewsContentService,
    private newsContentSimilarService: NewsContentSimilarService,
    private newsContentOtherInfoService: NewsContentOtherInfoService,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    private newsContentTagService: NewsContentTagService
  ) {
    this.fileManagerTree = new TreeModel();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  dataModel = new NewsContentModel();
  dataModelResult: ErrorExceptionResult<NewsContentModel> = new ErrorExceptionResult<NewsContentModel>();
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
  keywordDataModel = [];
  tagDataModel = [];
  similarDataModel = new Array<NewsContentModel>();
  otherInfoDataModel = new Array<NewsContentOtherInfoModel>();
  contentSimilarSelected: NewsContentModel = new NewsContentModel();
  contentOtherInfoSelected: NewsContentOtherInfoModel = new NewsContentOtherInfoModel();
  otherInfoTabledisplayedColumns = ['Title', 'TypeId', 'Action']
  similarTabledisplayedColumns = ['LinkMainImageIdSrc', 'Id', 'RecordStatus', 'Title', 'Action']
  similarTabledataSource = new MatTableDataSource<NewsContentModel>();
  otherInfoTabledataSource = new MatTableDataSource<NewsContentOtherInfoModel>();

  appLanguage = 'fa';

  viewMap = false;
  private mapModel: leafletMap;
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
  onActionFileSelectedLinkMainImageId(model: NodeInterface): void {
    this.dataModel.LinkMainImageId = model.id;
    this.dataModel.LinkMainImageIdSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkFilePodcastId(model: NodeInterface): void {
    this.dataModel.LinkFilePodcastId = model.id;
    this.dataModel.LinkFilePodcastIdSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkFileMovieId(model: NodeInterface): void {
    this.dataModel.LinkFileMovieId = model.id;
    this.dataModel.LinkFileMovieIdSrc = model.downloadLinksrc;
  }


  storeSnapshot = this.cmsStoreService.getStateSnapshot();
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

  receiveMap(model: leafletMap): void {
    this.mapModel = model;
    this.mapModel.on('click', (e) => {
      // @ts-ignore
      const lat = e.latlng.lat;
      // @ts-ignore
      const lon = e.latlng.lng;
      if (this.mapMarker !== undefined) {
        this.mapModel.removeLayer(this.mapMarker);
      }
      if (lat === this.dataModel.Geolocationlatitude && lon === this.dataModel.Geolocationlongitude) {
        this.dataModel.Geolocationlatitude = null;
        this.dataModel.Geolocationlongitude = null;
        return;
      }
      this.mapMarker = Leaflet.marker([lat, lon]).addTo(this.mapModel);
      this.dataModel.Geolocationlatitude = lat;
      this.dataModel.Geolocationlongitude = lon;
    });

  }

  receiveZoom(zoom: number): void {
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

    if (this.keywordDataModel && this.keywordDataModel.length > 0) {
      const listKeyword = this.keywordDataModel.map(x => x.display);
      if (listKeyword && listKeyword.length > 0) {
        this.dataModel.Keyword = listKeyword.join(',');
      }
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
          this.formInfo.FormSubmitAllow = true;;

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
  DataActionAfterAddContentSuccessfulTag(model: NewsContentModel): Promise<any> {
    if (!this.tagDataModel || this.tagDataModel.length === 0) {
      return;
    }
    const dataList = new Array<NewsContentTagModel>();
    this.tagDataModel.forEach(x => {
      const row = new NewsContentTagModel();
      row.LinkContentId = model.Id;
      row.LinkTagId = x.Id;
      dataList.push(row);
    });
    return this.newsContentTagService.ServiceAddBatch(dataList).pipe(
      map(response => {
        if (response.IsSuccess) {
          this.cmsToastrService.typeSuccessAddSimilar();
        } else {
          this.cmsToastrService.typeErrorAddSimilar();
        }
        console.log(response.ListItems);
        return of(response);
      })).toPromise();
  }
  DataActionAfterAddContentSuccessfulOtherInfo(model: NewsContentModel): Promise<any> {
    if (!this.otherInfoDataModel || this.otherInfoDataModel.length === 0) {
      return;
    }
    this.otherInfoDataModel.forEach(x => {
      x.LinkContentId = model.Id;
    });
    return this.newsContentOtherInfoService.ServiceAddBatch(this.otherInfoDataModel).pipe(
      map(response => {
        if (response.IsSuccess) {
          this.cmsToastrService.typeSuccessAddOtherInfo();
        } else {
          this.cmsToastrService.typeErrorAddOtherInfo();
        }
        return of(response);
      },
        (error) => {
          this.loading.display = false;
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorAdd(error);
        }
      )).toPromise();
  }
  DataActionAfterAddContentSuccessfulSimilar(model: NewsContentModel): Promise<any> {
    if (!this.similarDataModel || this.similarDataModel.length === 0) {
      return;
    }
    const dataList = new Array<NewsContentSimilarModel>();
    this.similarDataModel.forEach(x => {
      const row = new NewsContentSimilarModel();
      row.LinkSourceId = model.Id;
      row.LinkDestinationId = x.Id;
      dataList.push(row);
    });
    return this.newsContentSimilarService.ServiceAddBatch(dataList).pipe(
      map(response => {
        if (response.IsSuccess) {
          this.cmsToastrService.typeSuccessAddSimilar();
        } else {
          this.cmsToastrService.typeErrorAddSimilar();
        }
        return of(response);
      },
        (error) => {
          this.loading.display = false;
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorAdd(error);
        }
      )).toPromise();
  }
  onActionCategorySelect(model: NewsCategoryModel | null): void {
    if (!model || model.Id <= 0) {
      this.cmsToastrService.toastr.error(
        'دسته بندی را مشخص کنید',
        'دسته بندی اطلاعات مشخص نیست'
      );
      return;
    }
    this.dataModel.LinkCategoryId = model.Id;
  }
  onActionContentSimilarSelect(model: NewsContentModel | null): void {
    if (!model || model.Id <= 0) {
      return;
    }
    this.contentSimilarSelected = model;
  }
  onActionContentSimilarAddToLIst(): void {
    if (!this.contentSimilarSelected || this.contentSimilarSelected.Id <= 0) {
      return;
    }
    if (this.similarDataModel.find(x => x.Id === this.contentSimilarSelected.Id)) {
      this.cmsToastrService.typeErrorAddDuplicate();
      return;
    }
    this.similarDataModel.push(this.contentSimilarSelected);
    this.similarTabledataSource.data = this.similarDataModel;
  }
  onActionContentSimilarRemoveFromLIst(model: NewsContentModel | null): void {
    if (!model || model.Id <= 0) {
      return;
    }
    if (!this.similarDataModel || this.similarDataModel.length === 0) {
      return;
    }
    const retOut = new Array<NewsContentModel>();
    this.similarDataModel.forEach(x => {
      if (x.Id !== model.Id) {
        retOut.push(x);
      }
    });
    this.similarDataModel = retOut;
    this.similarTabledataSource.data = this.similarDataModel;
  }


  onActionContentOtherInfoAddToLIst(): void {
    if (!this.contentOtherInfoSelected) {
      return;
    }
    if (this.otherInfoDataModel.find(x => x.Title === this.contentOtherInfoSelected.Title)) {
      this.cmsToastrService.typeErrorAddDuplicate();
      return;
    }
    this.otherInfoDataModel.push(this.contentOtherInfoSelected);
    this.contentOtherInfoSelected = new NewsContentOtherInfoModel();
    this.otherInfoTabledataSource.data = this.otherInfoDataModel;
  }
  onActionContentOtherInfoRemoveFromLIst(index: number): void {

    if (index < 0) {
      return;
    }
    if (!this.otherInfoDataModel || this.otherInfoDataModel.length === 0) {
      return;
    }
    this.otherInfoDataModel.splice(index, 1);
    this.otherInfoTabledataSource.data = this.otherInfoDataModel;

  }
  onActionContentOtherInfoEditFromLIst(index: number): void {

    if (index < 0) {
      return;
    }
    if (!this.otherInfoDataModel || this.otherInfoDataModel.length === 0) {
      return;
    }
    this.contentOtherInfoSelected = this.otherInfoDataModel[index];
    this.otherInfoDataModel.splice(index, 1);
    this.otherInfoTabledataSource.data = this.otherInfoDataModel;

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
