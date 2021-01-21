import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as Leaflet from 'leaflet';
import { environment } from '../../../../../environments/environment';
import { FormControl, FormGroup } from '@angular/forms';
import { CoreEnumService, CoreModuleTagService, EnumModel, ErrorExceptionResult, FilterModel, FormInfoModel, NewsContentModel, NewsContentService, FilterDataModel, CoreModuleTagModel } from 'ntk-cms-api';
import { ActivatedRoute } from '@angular/router';
import KTWizard from '../../../../../assets/js/components/wizard';
import { KTUtil } from '../../../../../assets/js/components/util';
import { CmsToastrService } from 'src/app/_helpers/services/cmsToastr.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigInterface, DownloadModeEnum, NodeInterface, TreeModel } from 'ntk-cms-filemanager';


@Component({
  selector: 'app-news-content-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'
  ]
})
export class NewsContentAddComponent implements OnInit, AfterViewInit {


  constructor(
    private activatedRoute: ActivatedRoute,
    public coreEnumService: CoreEnumService,
    public coreModuleTagService: CoreModuleTagService,
    private newsContentService: NewsContentService,
    private toasterService: CmsToastrService
  ) {
    // this.dataModel.Body = ' Hello World';
    const treeConfig: ConfigInterface = {
      baseURL: 'https://apicms.ir/api/v1/',
      baseUploadURL: 'https://apifile.ir/api/v1/',
      api: {
        listFile: 'FileContent/GetAll',
        listFolder: 'FileCategory/GetAll',
        uploadFile: 'upload',
        downloadFile: 'download',
        deleteFile: 'FileContent',
        deleteFolder: 'FileCategory',
        createFolder: 'FileCategory',
        createFile: 'FileContent',
        getOneFile: 'FileContent',
        getOneFolder: 'FileCategory',
        renameFile: 'FileContent',
        renameFolder: 'FileCategory',
        searchFiles: 'FileCategory/GetAll',
      },
      options: {
        allowFolderDownload: DownloadModeEnum.DOWNLOAD_FILES,
        showFilesInsideTree: false,
        showSelectFile: true,
        showSelectFolder: false,
        showSelectFileType: [],
        title: 'فایل را انتخاب کنید',
      },
    };

    this.fileManagerTree = new TreeModel(treeConfig);
  }

  @ViewChild('wizard', { static: true }) el: ElementRef;
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  dataModelResult: ErrorExceptionResult<NewsContentModel> = new ErrorExceptionResult<NewsContentModel>();
  dataTagModelResult: ErrorExceptionResult<CoreModuleTagModel> = new ErrorExceptionResult<CoreModuleTagModel>();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();

  loadingStatus = false;
  dataModel = new NewsContentModel();
  linkCategoryId: number;
  formInfo: FormInfoModel = new FormInfoModel();
  theMarker: any;
  map: Leaflet.Map;
  model: any;
  lat: any;
  lon: any;
  wizard: any;
  fileManagerOpenForm = false;
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
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
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

  fileManagerTree: TreeModel;

  itemsAsObjects = [{ id: 0, display: 'Angular', readonly: true }, { id: 1, display: 'React' }];
  KeywordModel = [];
  TagModel = [];
  appLanguage = 'fa';
  items = ['Javascript', 'Typescript'];
  public requestAutocompleteItems = (text: string): Observable<any> => {
    // const url = `https://api.github.com/search/repositories?q=${text}`;
    // return this.http
    //   .get(url)
    //   .map((data: any) => data.items.map(item => item.full_name));
    const filteModel = new FilterModel();
    filteModel.RowPerPage = 20;
    filteModel.AccessLoad = true;
    // this.loading.backdropEnabled = false;
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
  }

  ngOnInit(): void {
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
