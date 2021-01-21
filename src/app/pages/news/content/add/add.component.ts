import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as Leaflet from 'leaflet';
import { environment } from '../../../../../environments/environment';
import { FormControl, FormGroup } from '@angular/forms';
import { CoreEnumService, EnumModel, ErrorExceptionResult, FormInfoModel, NewsContentModel, NewsContentService } from 'ntk-cms-api';
import { ActivatedRoute } from '@angular/router';
import KTWizard from '../../../../../assets/js/components/wizard';
import { KTUtil } from '../../../../../assets/js/components/util';
import { CmsToastrService } from 'src/app/_helpers/services/cmsToastr.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';


@Component({
  selector: 'app-news-content-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'
  ]
})
export class NewsContentAddComponent implements OnInit, AfterViewInit {

  @ViewChild('wizard', { static: true }) el: ElementRef;
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  dataModelResult: ErrorExceptionResult<NewsContentModel> = new ErrorExceptionResult<NewsContentModel>();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();

  loadingStatus = false;
  dataModel = new NewsContentModel();
  linkCategoryId: number;
  formInfo: FormInfoModel = new FormInfoModel();
  items = ['Javascript', 'Typescript'];
  theMarker: any;
  map: Leaflet.Map;
  model: any;
  lat: any;
  lon: any;
  wizard: any;


  constructor(
    private activatedRoute: ActivatedRoute,
    public coreEnumService: CoreEnumService,
    private newsContentService: NewsContentService,
    private toasterService: CmsToastrService
  ) {
    this.dataModel.Body = ' Hello World';

  }

  parentId = 0;


  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '30',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    // uploadUrl: 'v1/image',
    // uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
};
  ngOnInit(): void {
    // this.activatedRoute.queryParams.subscribe((params) => {
    //     this.parentId = +params.parentId || 0;
    // });
    this.parentId = Number(this.activatedRoute.snapshot.paramMap.get('parentId'));


    if (this.parentId === 0) {
      this.toasterService.typeErrorAddRowParentIsNull();
      return;
    }
    this.getEnumRecordStatus();
  }

  ngAfterViewInit(): void {

    this.wizard = new KTWizard(this.el.nativeElement, {
      startStep: 1
    });
    // Validation before going to next page
    this.wizard.on('change', (wizardObj) => {

      if (!this.formGroup.valid) {
        this.toasterService.typeErrorFormInvalid();
        const invalidElements = this.el.nativeElement.querySelectorAll('.ng-invalid');
        if (invalidElements.length > 0) {
          invalidElements[0].focus();
        }
        wizardObj.stop();
      }
      // https://angular.io/guide/forms
      // https://angular.io/guide/form-validation

      // validate the form and use below function to stop the wizard's step
      // wizardObj.stop();
    });

    // Change event
    this.wizard.on('change', (wizard: any) => {
      setTimeout(() => {
        KTUtil.scrollTop();
      }, 500);
    });
    this.map = Leaflet.map('map', { center: [32.684985, 51.6359425], zoom: 16 });
    Leaflet.tileLayer(environment.leafletUrl).addTo(this.map);
    this.map.on('click', (e) => {
      // @ts-ignore
      this.lat = e.latlng.lat;
      // @ts-ignore
      this.lon = e.latlng.lng;
      if (this.theMarker !== undefined) {
        this.map.removeLayer(this.theMarker);
      }
      this.theMarker = Leaflet.marker([this.lat, this.lon]).addTo(this.map);
    });
  }

  getEnumRecordStatus(): void {
    this.coreEnumService.ServiceEnumRecordStatus().subscribe((res) => {
      this.dataModelEnumRecordStatusResult = res;
    });
  }

  onFormSubmit(): void {
    if (this.parentId === 0) {
      this.toasterService.typeErrorAddRowParentIsNull();
      return;
    }
    // if (this.singUpContentForm.valid) {
    //     this.formInfo.FormAllowSubmit = false;
    //     this.DataAddContent();
    // }
  }

  DataAddContent(): void {

    this.dataModel.Geolocationlatitude = this.lat;
    this.dataModel.Geolocationlongitude = this.lon;
    if (this.linkCategoryId <= 0) {
      this.toasterService.toastr.error(
        'دسته بندی را مشخص کنید',
        'دسته بندی اطلاعات مشخص نیست'
      );
      return;
    }
    this.dataModel.LinkCategoryId = this.parentId;
    this.formInfo.FormAlert = 'در حال ارسال اطلاعات به سرور';
    this.formInfo.FormError = '';
    this.loadingStatus = true;
    this.newsContentService
      .ServiceAdd(this.dataModel)
      .subscribe(
        (next) => {
          this.loadingStatus = false;
          this.formInfo.FormAllowSubmit = !next.IsSuccess;
          this.dataModelResult = next;
          if (next.IsSuccess) {
            this.formInfo.FormAlert = 'ثبت با موفقت انجام شد';
            this.toasterService.typeSuccessAdd();
          } else {
            this.toasterService.typeErrorAdd(next.ErrorMessage);
          }
        },
        (error) => {
          this.loadingStatus = false;
          this.formInfo.FormAllowSubmit = true;

          const title = 'برروی خطا در دریافت اطلاعات';
          this.toasterService.typeError(error);
        }
      );
  }

  onValueChange(model: any): any {
    return model.value;
  }

}
