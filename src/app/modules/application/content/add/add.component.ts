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
import { PoinModel } from 'src/app/core/models/pointModel';
import { Map as leafletMap } from 'leaflet';
import * as Leaflet from 'leaflet';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-aplication-intro-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class ApplicationAppAddComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private cmsStoreService: CmsStoreService,
    public publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    public applicationEnumService: ApplicationEnumService,
    private applicationAppService: ApplicationAppService,
    private cmsToastrService: CmsToastrService,
    private translate: TranslateService,
    private router: Router) {
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  requestSourceId = 0;

  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  loading = new ProgressSpinnerModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataAccessModel: AccessModel;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  dataModel = new ApplicationAppModel();
  dataModelResult: ErrorExceptionResult<ApplicationAppModel> = new ErrorExceptionResult<ApplicationAppModel>();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  dataModelEnumLangResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerOpenFormAboutUsLinkImageId = false;
  fileManagerOpenFormLinkFileIdIcon = false;
  fileManagerOpenFormLinkFileIdLogo = false;
  fileManagerOpenFormLinkFileIdSplashScreen = false;
  fileManagerOpenFormLinkMainImageId = false;

  appLanguage = 'fa';

  fileManagerTree: TreeModel;
  mapMarker: any;
  private mapModel: leafletMap;
  private mapMarkerPoints: Array<PoinModel> = [];
  mapOptonCenter = {};
  storeSnapshot = this.cmsStoreService.getStateSnapshot();
  ngOnInit(): void {
    this.requestSourceId = + Number(this.activatedRoute.snapshot.paramMap.get('SourceId'));
    if (this.requestSourceId === 0) {
      this.cmsToastrService.typeErrorAddRowParentIsNull();
      return;
    }
    this.dataModel.LinkSourceId = this.requestSourceId;
    this.DataGetAccess();
    this.getEnumRecordStatus();
    this.getEnumLang();
  }
  getEnumLang(): void {
    this.coreEnumService.ServiceEnumLanguage().subscribe((res) => {
      this.dataModelEnumLangResult = res;
    });
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
    if (this.dataModel.LinkSourceId <= 0) {
      this.cmsToastrService.typeErrorAdd(this.translate.instant('MESSAGE.Specify_the_source_code_of_the_program'));

      return;
    }
    if (this.dataModel.LinkThemeConfigId <= 0) {
      this.cmsToastrService.typeErrorAdd(this.translate.instant('MESSAGE.Specify_the_application_format'));
      return;
    }
    this.DataAddContent();
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
            this.cmsToastrService.typeErrorGetAccess(next.ErrorMessage);
          }
        },
        (error) => {
          this.cmsToastrService.typeErrorGetAccess(error);
        }
      );
  }

  DataAddContent(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = 'در حال ارسال اطلاعات به سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;
    this.applicationAppService.setAccessLoad();
    this.applicationAppService
      .ServiceAdd(this.dataModel)
      .subscribe(
        async (next) => {
          this.loading.display = false;
          this.formInfo.FormSubmitAllow = !next.IsSuccess;
          this.dataModelResult = next;
          if (next.IsSuccess) {
            this.formInfo.FormAlert = 'ثبت با موفقیت انجام شد';
            this.cmsToastrService.typeSuccessAdd();
            setTimeout(() => this.router.navigate(['/application/app/']), 100);
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
      if (lat === this.dataModel.AboutUsGeolocationlatitude && lon === this.dataModel.AboutUsGeolocationlongitude) {
        this.dataModel.AboutUsGeolocationlatitude = null;
        this.dataModel.AboutUsGeolocationlongitude = null;
        return;
      }
      this.mapMarker = Leaflet.marker([lat, lon]).addTo(this.mapModel);
      this.dataModel.AboutUsGeolocationlatitude = lat;
      this.dataModel.AboutUsGeolocationlongitude = lon;
    });

  }
  onActionBackToParent(): void {
    this.router.navigate(['/application/app/']);
  }
  onActionFileSelectedLinkMainImageId(model: NodeInterface): void {
    this.dataModel.LinkMainImageId = model.id;
    this.dataModel.LinkMainImageIdSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkFileIdIcon(model: NodeInterface): void {
    this.dataModel.LinkFileIdIcon = model.id;
    this.dataModel.LinkFileIdIconSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkFileIdLogo(model: NodeInterface): void {
    this.dataModel.LinkFileIdLogo = model.id;
    this.dataModel.LinkFileIdLogoSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkFileIdSplashScreen(model: NodeInterface): void {
    this.dataModel.LinkFileIdSplashScreen = model.id;
    this.dataModel.LinkFileIdSplashScreenSrc = model.downloadLinksrc;
  }
  onActionFileSelectedAboutUsLinkImageId(model: NodeInterface): void {
    this.dataModel.AboutUsLinkImageId = model.id;
    this.dataModel.AboutUsLinkImageIdSrc = model.downloadLinksrc;
  }
  onActionSelectSource(model: ApplicationSourceModel | null): void {
    if (!model || model.Id <= 0) {
      this.cmsToastrService.typeErrorMessage(
        this.translate.instant('MESSAGE.The_source_of_the_information_application_is_not_known'),
        this.translate.instant('MESSAGE.Specify_the_source')
        );
      return;
    }
    this.dataModel.LinkSourceId = model.Id;
  }
  onActionSelectTheme(model: ApplicationThemeConfigModel | null): void {
    if (!model || model.Id <= 0) {
      this.cmsToastrService.typeErrorMessage(
        this.translate.instant('MESSAGE.Information_application_format_is_not_clear'),
        this.translate.instant('MESSAGE.Specify_the_template'));

     return;
    }
    this.dataModel.LinkThemeConfigId = model.Id;
  }
}
