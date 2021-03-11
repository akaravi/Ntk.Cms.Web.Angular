import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as Leaflet from 'leaflet';
import { FormGroup } from '@angular/forms';
import {
  CoreEnumService,
  EnumModel,
  ErrorExceptionResult,
  FormInfoModel,
  ArticleContentModel,
  ArticleContentService,
  ArticleCategoryModel,
  ArticleContentTagService,
  ArticleContentTagModel,
  ArticleContentSimilarService,
  ArticleContentSimilarModel,
  ArticleContentOtherInfoService,
  ArticleContentOtherInfoModel
} from 'ntk-cms-api';
import { ActivatedRoute, Router } from '@angular/router';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import { Map as leafletMap } from 'leaflet';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';


@Component({
  selector: 'app-article-content-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'
  ]
})
export class ArticleContentAddComponent implements OnInit, AfterViewInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private cmsStoreService: CmsStoreService,
    public coreEnumService: CoreEnumService,
    public publicHelper: PublicHelper,
    private articleContentService: ArticleContentService,
    private articleContentSimilarService: ArticleContentSimilarService,
    private articleContentOtherInfoService: ArticleContentOtherInfoService,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    private articleContentTagService: ArticleContentTagService
  ) {
    this.fileManagerTree = new TreeModel();
  }
  requestCategoryId = 0;
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  dataModel = new ArticleContentModel();
  dataModelResult: ErrorExceptionResult<ArticleContentModel> = new ErrorExceptionResult<ArticleContentModel>();
  // datatagDataModelResult: ErrorExceptionResult<CoreModuleTagModel> = new ErrorExceptionResult<CoreModuleTagModel>();
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
  similarDataModel = new Array<ArticleContentModel>();
  otherInfoDataModel = new Array<ArticleContentOtherInfoModel>();
  contentSimilarSelected: ArticleContentModel = new ArticleContentModel();
  contentOtherInfoSelected: ArticleContentOtherInfoModel = new ArticleContentOtherInfoModel();
  otherInfoTabledisplayedColumns = ['Title', 'TypeId', 'Action'];
  similarTabledisplayedColumns = ['LinkMainImageIdSrc', 'Id', 'RecordStatus', 'Title', 'Action'];
  similarTabledataSource = new MatTableDataSource<ArticleContentModel>();
  otherInfoTabledataSource = new MatTableDataSource<ArticleContentOtherInfoModel>();

  appLanguage = 'fa';

  viewMap = false;
  private mapModel: leafletMap;


  storeSnapshot = this.cmsStoreService.getStateSnapshot();
  ngOnInit(): void {
    this.requestCategoryId = Number(this.activatedRoute.snapshot.paramMap.get('CategoryId'));
    if (this.requestCategoryId === 0) {
      this.cmsToastrService.typeErrorAddRowParentIsNull();
      return;
    }
    this.dataModel.LinkCategoryId = this.requestCategoryId;
    this.getEnumRecordStatus();
  }
  ngAfterViewInit(): void {
    // this.optionsCategorySelector.childMethods.ActionSelectForce(this.requestCategoryId);
    // this.optionsCategorySelector.parentMethods = {
    //   onActionSelect: (x) => this.onActionCategorySelect(x),
    // };
    // this.optionsContentSelector.parentMethods = {
    //   onActionSelect: (x) => this.onActionContentSimilarSelect(x),
    // };
  }

  onActionTagChange(model: any): void {
    this.tagDataModel = model;
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
    if (this.dataModel.LinkCategoryId <= 0) {
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
    this.DataAddContent();
  }

  DataAddContent(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = 'در حال ارسال اطلاعات به سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;

    this.articleContentService
      .ServiceAdd(this.dataModel)
      .subscribe(
        async (next) => {
          this.loading.display = false;
          this.formInfo.FormSubmitAllow = !next.IsSuccess;
          this.dataModelResult = next;
          if (next.IsSuccess) {

            this.formInfo.FormAlert = 'ثبت با موفقیت انجام شد';
            this.cmsToastrService.typeSuccessAdd();
            await this.DataActionAfterAddContentSuccessfulTag(this.dataModelResult.Item);
            await this.DataActionAfterAddContentSuccessfulSimilar(this.dataModelResult.Item);
            await this.DataActionAfterAddContentSuccessfulOtherInfo(this.dataModelResult.Item);
            this.loading.display = false;
            setTimeout(() => this.router.navigate(['/article/content/']), 100);
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
  DataActionAfterAddContentSuccessfulTag(model: ArticleContentModel): Promise<any> {
    if (!this.tagDataModel || this.tagDataModel.length === 0) {
      return;
    }
    const dataListAdd = new Array<ArticleContentTagModel>();
    this.tagDataModel.forEach(x => {
      const row = new ArticleContentTagModel();
      row.LinkContentId = model.Id;
      row.LinkTagId = x.Id;
      dataListAdd.push(row);
    });
    return this.articleContentTagService.ServiceAddBatch(dataListAdd).pipe(
      map(response => {
        if (response.IsSuccess) {
          this.cmsToastrService.typeSuccessAddTag();
        } else {
          this.cmsToastrService.typeErrorAddTag();
        }
        return of(response);
      })).toPromise();
  }
  DataActionAfterAddContentSuccessfulOtherInfo(model: ArticleContentModel): Promise<any> {
    if (!this.otherInfoDataModel || this.otherInfoDataModel.length === 0) {
      return;
    }
    this.otherInfoDataModel.forEach(x => {
      x.LinkContentId = model.Id;
    });
    return this.articleContentOtherInfoService.ServiceAddBatch(this.otherInfoDataModel).pipe(
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
  DataActionAfterAddContentSuccessfulSimilar(model: ArticleContentModel): Promise<any> {
    if (!this.similarDataModel || this.similarDataModel.length === 0) {
      return;
    }
    const dataList: ArticleContentSimilarModel[] = [];
    this.similarDataModel.forEach(x => {
      const row = new ArticleContentSimilarModel();
      row.LinkSourceId = model.Id;
      row.LinkDestinationId = x.Id;
      dataList.push(row);
    });
    return this.articleContentSimilarService.ServiceAddBatch(dataList).pipe(
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
  onActionCategorySelect(model: ArticleCategoryModel | null): void {
    if (!model || model.Id <= 0) {
      this.cmsToastrService.toastr.error(
        'دسته بندی را مشخص کنید',
        'دسته بندی اطلاعات مشخص نیست'
      );
      return;
    }
    this.dataModel.LinkCategoryId = model.Id;
  }
  onActionContentSimilarSelect(model: ArticleContentModel | null): void {
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
  onActionContentSimilarRemoveFromLIst(model: ArticleContentModel | null): void {
    if (!model || model.Id <= 0) {
      return;
    }
    if (!this.similarDataModel || this.similarDataModel.length === 0) {
      return;
    }
    const retOut = new Array<ArticleContentModel>();
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
    this.contentOtherInfoSelected = new ArticleContentOtherInfoModel();
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
    this.router.navigate(['/article/content/']);
  }
}
