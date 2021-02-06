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

@Component({
  selector: 'app-aplication-intro-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class ApplicationAppAddComponent implements OnInit {
  requestSourceId = 0;

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
  mapMarker: any;
  private mapModel: leafletMap;
  private mapMarkerPoints: Array<PoinModel> = [];
  mapOptonCenter = {};
  ngOnInit(): void {
    this.requestSourceId = Number(this.activatedRoute.snapshot.paramMap.get('SourceId'));
    if (this.requestSourceId === 0) {
      this.toasterService.typeErrorAddRowParentIsNull();
      return;
    }
    this.dataModel.LinkSourceId = this.requestSourceId;
    this.DataGetAccess();
    this.getEnumRecordStatus();
  }
  getEnumRecordStatus(): void {
    this.coreEnumService.ServiceEnumRecordStatus().subscribe((res) => {
      this.dataModelEnumRecordStatusResult = res;
    });
  }

  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      this.toasterService.typeErrorFormInvalid();
      return;
    }
    if (this.dataModel.LinkSourceId <= 0) {
      this.toasterService.typeErrorEdit('سورس کد برنامه مشخص  کنید');

      return;
    }
    if (this.dataModel.LinkThemeConfigId <= 0) {
      this.toasterService.typeErrorEdit('قالب  برنامه مشخص  کنید');
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
            this.toasterService.typeErrorGetAccess(next.ErrorMessage);
          }
        },
        (error) => {
          this.toasterService.typeErrorGetAccess(error);
        }
      );
  }

  DataAddContent(): void {
    this.formInfo.FormAllowSubmit = false;
    this.formInfo.FormAlert = 'در حال ارسال اطلاعات به سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;

    this.applicationAppService
      .ServiceAdd(this.dataModel)
      .subscribe(
        async (next) => {
          this.loading.display = false;
          this.formInfo.FormAllowSubmit = !next.IsSuccess;
          this.dataModelResult = next;
          if (next.IsSuccess) {
            this.formInfo.FormAlert = 'ثبت با موفقیت انجام شد';
            this.toasterService.typeSuccessEdit();
            this.router.navigate(['/application/app/']);
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
