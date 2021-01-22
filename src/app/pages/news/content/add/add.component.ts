import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as Leaflet from 'leaflet';
import { FormControl, FormGroup } from '@angular/forms';
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
  CoreModuleTagModel
} from 'ntk-cms-api';
import { ActivatedRoute } from '@angular/router';
import KTWizard from '../../../../../assets/js/components/wizard';
import { KTUtil } from '../../../../../assets/js/components/util';
import { CmsToastrService } from 'src/app/core/helpers/services/cmsToastr.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigInterface, DownloadModeEnum, NodeInterface, TreeModel } from 'ntk-cms-filemanager';
// https://stackblitz.com/edit/tag-input?file=app%2Fapp.component.css
import {Map} from 'leaflet';
import * as L from 'leaflet';


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
        title: 'فایل را انتخاب کنید',
      },
    };

    this.fileManagerTree = new TreeModel(treeConfig);
  }

  @ViewChild('wizard', { static: true }) el: ElementRef;
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  dataModel = new NewsContentModel();
  dataModelResult: ErrorExceptionResult<NewsContentModel> = new ErrorExceptionResult<NewsContentModel>();
  dataTagModelResult: ErrorExceptionResult<CoreModuleTagModel> = new ErrorExceptionResult<CoreModuleTagModel>();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  loadingStatus = false;
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  selectFileTypePodcast = ['mp3'];
  linkCategoryId: number;
  formInfo: FormInfoModel = new FormInfoModel();
  theMarker: any;

  model: any;

  wizard: any;
  fileManagerOpenForm = false;
  fileManagerOpenFormPodcast = false;
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
  KeywordModel = [];
  TagModel = [];
  appLanguage = 'fa';

  viewMap = false;
  private map: Map;
  private zoom: number;
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
      this.viewMap = false;
      setTimeout(() => {
        KTUtil.scrollTop();
        this.viewMap = true;
      }, 700);
    });

    // Change event
    this.wizard.on('change', (wizard: any) => {
      setTimeout(() => {
        KTUtil.scrollTop();
      }, 500);
      this.map.invalidateSize();

    });

  }

  getEnumRecordStatus(): void {
    this.coreEnumService.ServiceEnumRecordStatus().subscribe((res) => {
      this.dataModelEnumRecordStatusResult = res;
    });
  }

  receiveMap(map: Map): void {
    this.map = map;

    // const marker = L.marker([32.684985, 51.6359425]).addTo(map);
    // const marker =  L.marker([32.684985, 51.6359425], {
      // icon: this.icons.online,

    // }).on('click',
    //   (data) => {
    //     alert("I have a click.")
    //   } ).addTo(this.map);
    this.map.on('click', (e) => {
      // @ts-ignore
      const lat = e.latlng.lat;
      // @ts-ignore
      const lon = e.latlng.lng;
      if (this.theMarker !== undefined) {
        this.map.removeLayer(this.theMarker);
      }
      if (lat === this.dataModel.Geolocationlatitude && lon === this.dataModel.Geolocationlongitude){
        this.dataModel.Geolocationlatitude = null;
        this.dataModel.Geolocationlongitude = null;
  return;
}
      this.theMarker = Leaflet.marker([lat, lon]).addTo(this.map);
      this.dataModel.Geolocationlatitude = lat;
      this.dataModel.Geolocationlongitude = lon;
    });

  }

  receiveZoom(zoom: number): void {
    this.zoom = zoom;
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


}
