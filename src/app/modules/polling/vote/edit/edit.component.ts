import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import * as Leaflet from 'leaflet';
import { FormGroup } from '@angular/forms';
import {
  CoreEnumService,
  EnumModel,
  ErrorExceptionResult,
  FilterModel,
  FormInfoModel,
  PollingContentModel,
  PollingContentService,
  FilterDataModel,
  PollingCategoryModel,
  PollingContentTagService,
  PollingContentTagModel,
  PollingContentSimilarService,
  PollingContentOtherInfoService,
  PollingContentOtherInfoModel,
  PollingContentSimilarModel
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

@Component({
  selector: 'app-polling-content-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'
  ]
})
export class PollingContentEditComponent implements OnInit, AfterViewInit {
  requestId = 0;
  constructor(
    private activatedRoute: ActivatedRoute,
    public coreEnumService: CoreEnumService,
    public publicHelper: PublicHelper,
        private pollingContentService: PollingContentService,
    private pollingContentTagService: PollingContentTagService,
    private pollingContentSimilarService: PollingContentSimilarService,
    private pollingContentOtherInfoService: PollingContentOtherInfoService,
    private toasterService: CmsToastrService,
    private router: Router,

  ) {
    this.fileManagerTree = new TreeModel();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  dataModel = new PollingContentModel();
  dataModelResult: ErrorExceptionResult<PollingContentModel> = new ErrorExceptionResult<PollingContentModel>();
  dataContentTagModelResult: ErrorExceptionResult<PollingContentTagModel> = new ErrorExceptionResult<PollingContentTagModel>();
  dataContentSimilarModelResult: ErrorExceptionResult<PollingContentSimilarModel> = new ErrorExceptionResult<PollingContentSimilarModel>();
  dataContentOtherInfoModelResult: ErrorExceptionResult<PollingContentOtherInfoModel> = new ErrorExceptionResult<PollingContentOtherInfoModel>();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  similarDataModel = new Array<PollingContentModel>();
  otherInfoDataModel = new Array<PollingContentOtherInfoModel>();
  contentSimilarSelected: PollingContentModel = new PollingContentModel();
  contentOtherInfoSelected: PollingContentOtherInfoModel = new PollingContentOtherInfoModel();
  otherInfoTabledisplayedColumns = ['Id', 'Title', 'TypeId', 'Action'];
  similarTabledisplayedColumns = ['LinkMainImageIdSrc', 'Id', 'RecordStatus', 'Title', 'Action'];
  similarTabledataSource = new MatTableDataSource<PollingContentModel>();
  otherInfoTabledataSource = new MatTableDataSource<PollingContentOtherInfoModel>();

  loading = new ProgressSpinnerModel();
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  selectFileTypePodcast = ['mp3'];
  selectFileTypeMovie = ['mp4'];
  formInfo: FormInfoModel = new FormInfoModel();
  fileManagerOpenForm = false;
  fileManagerOpenFormPodcast = false;
  fileManagerOpenFormMovie = false;
  fileManagerTree: TreeModel;
  keywordDataModel = [];
  tagIdsData: number[];


  appLanguage = 'fa';

  viewMap = false;
  mapMarker: any;
  private mapModel: leafletMap;
  private mapMarkerPoints: Array<PoinModel> = [];
  mapOptonCenter = {};
  ngOnInit(): void {
    this.requestId = Number(this.activatedRoute.snapshot.paramMap.get('Id'));
    if (this.requestId === 0) {
      this.toasterService.typeErrorAddRowParentIsNull();
      return;
    }
    this.DataGetOne();
    this.getEnumRecordStatus();
  }
  ngAfterViewInit(): void {

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
    this.coreEnumService.ServiceEnumRecordStatus().subscribe((res) => {
      this.dataModelEnumRecordStatusResult = res;
    });
  }


  onFormSubmit(): void {
    if (this.requestId <= 0) {
      this.toasterService.typeErrorAddRowParentIsNull();
      return;
    }
    if (!this.formGroup.valid) {
      this.toasterService.typeErrorFormInvalid();
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
    this.formInfo.FormAllowSubmit = false;
    this.formInfo.FormAlert = 'در حال دریافت اطلاعات از سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;

    this.pollingContentService
      .ServiceGetOneById(this.requestId)
      .subscribe(
        async (next) => {
          this.loading.display = false;
          this.dataModelResult = next;
          this.formInfo.FormAllowSubmit = true;

          if (next.IsSuccess) {
            this.dataModel = next.Item;
            const lat = this.dataModel.Geolocationlatitude;
            const lon = this.dataModel.Geolocationlongitude;
            if (lat > 0 && lon > 0) {
              this.mapMarkerPoints.push({ lat, lon });
            }
            this.keywordDataModel = this.dataModel.Keyword.split(',');
            this.DataTagGetAll();
            this.DataOtherInfoGetAll();
            this.DataSimilarGetAllIds();
            this.loading.display = false;
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
  DataTagGetAll(): void {
    this.formInfo.FormAllowSubmit = false;
    this.formInfo.FormAlert = 'در حال دریافت اطلاعات تگها از سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;


    const filteModel = new FilterModel();

    const aaa3 = {
      PropertyName: 'LinkContentId',
      Value: this.dataModelResult.Item.Id + '',
    };
    filteModel.Filters.push(aaa3 as FilterDataModel);
    this.tagIdsData = [];
    this.pollingContentTagService
      .ServiceGetAll(filteModel)
      .subscribe(
        async (next) => {
          this.loading.display = false;
          this.dataContentTagModelResult = next;
          this.formInfo.FormAllowSubmit = true;

          if (next.IsSuccess) {
            const list = [];
            this.dataContentTagModelResult.ListItems.forEach(x => {
              list.push(x.LinkTagId);
            });
            this.tagIdsData = list;


            this.loading.display = false;
          } else {
            this.toasterService.typeErrorGetAll(next.ErrorMessage);
          }
        },
        (error) => {
          this.loading.display = false;
          this.formInfo.FormAllowSubmit = true;
          this.toasterService.typeErrorGetAll(error);
        }
      );
  }
  DataOtherInfoGetAll(): void {
    this.formInfo.FormAllowSubmit = false;
    this.formInfo.FormAlert = 'در حال دریافت سایر اطلاعات از سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;


    const filteModel = new FilterModel();

    const aaa3 = {
      PropertyName: 'LinkContentId',
      Value: this.dataModelResult.Item.Id + '',
    };
    filteModel.Filters.push(aaa3 as FilterDataModel);
    this.pollingContentOtherInfoService
      .ServiceGetAll(filteModel)
      .subscribe(
        async (next) => {
          this.loading.display = false;
          this.formInfo.FormAllowSubmit = true;
          this.dataContentOtherInfoModelResult = next;
          if (next.IsSuccess) {
            this.otherInfoDataModel = next.ListItems;
            this.otherInfoTabledataSource.data = next.ListItems;
          } else {
            this.toasterService.typeErrorGetAll(next.ErrorMessage);
          }
        },
        (error) => {
          this.loading.display = false;
          this.formInfo.FormAllowSubmit = true;
          this.toasterService.typeErrorGetAll(error);
        }
      );
  }
  DataSimilarGetAllIds(): void {
    this.formInfo.FormAllowSubmit = false;
    this.formInfo.FormAlert = 'در حال دریافت سایر اطلاعات از سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;


    const filteModel = new FilterModel();

    const aaa1 = {
      PropertyName: 'LinkSourceId',
      Value: this.dataModelResult.Item.Id + '',
      ClauseType: 1
    };
    const aaa2 = {
      PropertyName: 'LinkDestinationId',
      Value: this.dataModelResult.Item.Id + '',
      ClauseType: 1
    };
    filteModel.Filters.push(aaa1 as FilterDataModel);
    filteModel.Filters.push(aaa2 as FilterDataModel);

    this.pollingContentSimilarService
      .ServiceGetAll(filteModel)
      .subscribe(
        async (next) => {
          this.loading.display = false;
          this.formInfo.FormAllowSubmit = true;
          this.dataContentSimilarModelResult = next;
          if (next.IsSuccess) {
            const listIds = Array<number>();
            next.ListItems.forEach(x => {
              if (x.LinkDestinationId === this.dataModelResult.Item.Id) {
                listIds.push(x.LinkSourceId);
              } else {
                listIds.push(x.LinkDestinationId);
              }
            });
            this.DataSimilarGetAll(listIds);

          } else {
            this.toasterService.typeErrorGetAll(next.ErrorMessage);
          }
        },
        (error) => {
          this.loading.display = false;
          this.formInfo.FormAllowSubmit = true;
          this.toasterService.typeErrorGetAll(error);
        }
      );
  }
  DataSimilarGetAll(ids: Array<number>): void {
    if (!ids || ids.length === 0) {
      return;
    }

    this.formInfo.FormAllowSubmit = false;
    this.formInfo.FormAlert = 'در حال دریافت سایر اطلاعات از سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;


    const filteModel = new FilterModel();
    ids.forEach(item => {
      const aaa3 = {
        PropertyName: 'Id',
        Value: item + '',
        ClauseType: 1
      };
      filteModel.Filters.push(aaa3 as FilterDataModel);
    });
    this.pollingContentService
      .ServiceGetAll(filteModel)
      .subscribe(
        async (next) => {
          this.loading.display = false;
          this.formInfo.FormAllowSubmit = true;

          if (next.IsSuccess) {
            this.similarDataModel = next.ListItems;
            this.similarTabledataSource.data = next.ListItems;
          } else {
            this.toasterService.typeErrorGetAll(next.ErrorMessage);
          }
        },
        (error) => {
          this.loading.display = false;
          this.formInfo.FormAllowSubmit = true;
          this.toasterService.typeErrorGetAll(error);
        }
      );
  }
  DataEditContent(): void {
    this.formInfo.FormAllowSubmit = false;
    this.formInfo.FormAlert = 'در حال ارسال اطلاعات به سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;

    this.pollingContentService
      .ServiceEdit(this.dataModel)
      .subscribe(
        async (next) => {
          this.loading.display = false;
          this.formInfo.FormAllowSubmit = true;
          this.dataModelResult = next;
          if (next.IsSuccess) {

            this.formInfo.FormAlert = 'ثبت با موفقیت انجام شد';
            this.toasterService.typeSuccessAdd();
            await this.DataActionAfterAddContentSuccessfulTag(this.dataModelResult.Item);
            await this.DataActionAfterAddContentSuccessfulSimilar(this.dataModelResult.Item);
            await this.DataActionAfterAddContentSuccessfulOtherInfo(this.dataModelResult.Item);
            this.loading.display = false;
            this.router.navigate(['/polling/edit/', this.requestId]);
          } else {
            this.toasterService.typeErrorAdd(next.ErrorMessage);
          }
        },
        (error) => {
          this.loading.display = false;
          this.formInfo.FormAllowSubmit = true;
          this.toasterService.typeErrorAdd(error);
        }
      );
  }
  async DataActionAfterAddContentSuccessfulTag(model: PollingContentModel): Promise<any> {

    const dataListAdd = new Array<PollingContentTagModel>();
    const dataListDelete = new Array<PollingContentTagModel>();
    if (this.tagIdsData) {
      this.tagIdsData.forEach(item => {
        const row = new PollingContentTagModel();
        row.LinkContentId = model.Id;
        row.LinkTagId = item;
        if (!this.dataContentTagModelResult.ListItems || !this.dataContentTagModelResult.ListItems.find(x => x.LinkTagId === item)) {
          dataListAdd.push(row);
        }
      });
    }
    if (this.dataContentTagModelResult.ListItems) {
      this.dataContentTagModelResult.ListItems.forEach(item => {
        if (!this.tagIdsData || !this.tagIdsData.find(x => x === item.LinkTagId)) {
          dataListDelete.push(item);
        }
      });
    }


    if (dataListAdd && dataListAdd.length > 0) {
    }
    if (dataListDelete && dataListDelete.length > 0) {
    }
  }
  async DataActionAfterAddContentSuccessfulOtherInfo(model: PollingContentModel): Promise<any> {
    const dataListAdd = new Array<PollingContentOtherInfoModel>();
    const dataListDelete = new Array<PollingContentOtherInfoModel>();
    if (this.otherInfoDataModel) {
      this.otherInfoDataModel.forEach(item => {
        const row = new PollingContentOtherInfoModel();
        row.LinkContentId = model.Id;
        if (!this.dataContentOtherInfoModelResult.ListItems || !item.Id|| !this.dataContentOtherInfoModelResult.ListItems.find(x => x.Id === item.Id)) {
          dataListAdd.push(row);
        }
      });
    }
    if (this.dataContentOtherInfoModelResult.ListItems) {
      this.dataContentOtherInfoModelResult.ListItems.forEach(item => {
        if (!this.otherInfoDataModel || !this.otherInfoDataModel.find(x => x.Id === item.Id)) {
          dataListDelete.push(item);
        }
      });
    }




    if (dataListAdd && dataListAdd.length > 0) {
    }
    if (dataListDelete && dataListDelete.length > 0) {
    }
  }
  async DataActionAfterAddContentSuccessfulSimilar(model: PollingContentModel): Promise<any> {
    const dataListAdd = new Array<PollingContentSimilarModel>();
    const dataListDelete = new Array<PollingContentSimilarModel>();
    if (this.similarDataModel) {
      this.similarDataModel.forEach(item => {
        const row = new PollingContentSimilarModel();
        row.LinkSourceId = model.Id;
        row.LinkDestinationId = item.Id;
        if (!this.dataContentSimilarModelResult.ListItems ||
          !this.dataContentSimilarModelResult.ListItems.find(x => x.LinkSourceId === item.Id || x.LinkDestinationId === item.Id)) {
          dataListAdd.push(row);
        }
      });
    }
    if (this.dataContentSimilarModelResult.ListItems) {
      this.dataContentSimilarModelResult.ListItems.forEach(item => {
        if (!this.similarDataModel || !this.similarDataModel.find(x => x.Id === item.LinkSourceId || x.Id === item.LinkDestinationId)) {
          dataListDelete.push(item);
        }
      });
    }




    if (dataListAdd && dataListAdd.length > 0) {
    }
    if (dataListDelete && dataListDelete.length > 0) {
    }



  }
  onActionCategorySelect(model: PollingCategoryModel | null): void {
    if (!model || model.Id <= 0) {
      this.toasterService.toastr.error(
        'دسته بندی را مشخص کنید',
        'دسته بندی اطلاعات مشخص نیست'
      );
      return;
    }
    this.dataModel.LinkCategoryId = model.Id;
  }
  onActionTagChange(ids: number[]): void {
    this.tagIdsData = ids;
  }
  onActionContentSimilarSelect(model: PollingContentModel | null): void {
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
      this.toasterService.typeErrorAddDuplicate();
      return;
    }
    this.similarDataModel.push(this.contentSimilarSelected);
    this.similarTabledataSource.data = this.similarDataModel;
  }
  onActionContentSimilarRemoveFromLIst(model: PollingContentModel | null): void {
    if (!model || model.Id <= 0) {
      return;
    }
    if (!this.similarDataModel || this.similarDataModel.length === 0) {
      return;
    }
    const retOut = new Array<PollingContentModel>();
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
      this.toasterService.typeErrorAddDuplicate();
      return;
    }
    this.otherInfoDataModel.push(this.contentOtherInfoSelected);
    this.contentOtherInfoSelected = new PollingContentOtherInfoModel();
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
        this.toasterService.typeErrorFormInvalid();
        setTimeout(() => {
          stepper.selectedIndex = event.previouslySelectedIndex;
          // stepper.previous();
        }, 10);
      }
    }
  }
  onActionBackToParent(): void {
    this.router.navigate(['/polling/content/']);
  }
  receiveMap(model: leafletMap): void {
    this.mapModel = model;

    if (this.mapMarkerPoints && this.mapMarkerPoints.length > 0) {
      this.mapMarkerPoints.forEach(item => {
        this.mapMarker = Leaflet.marker([item.lat, item.lon]).addTo(this.mapModel);
      });
      this.mapOptonCenter = this.mapMarkerPoints[0];
      this.mapMarkerPoints = [];
    }

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

  receiveZoom(): void {
  }
}
