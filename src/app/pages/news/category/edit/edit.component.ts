import { CoreEnumService, EnumModel, ErrorExceptionResult, FormInfoModel, NewsCategoryService, NewsCategoryModel, FileUploadedModel } from 'ntk-cms-api';
import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CmsToastrService } from 'src/app/_helpers/services/cmsToastr.service';
import { ComponentActionEnum } from 'src/app/_helpers/model/component-action-enum';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { ComponentOptionFileUploadModel } from 'src/app/core/cmsComponentModels/files/componentOptionFileUploadModel';
import { ConfigInterface, DownloadModeEnum, TreeModel, NodeInterface } from 'ntk-cms-filemanager';





@Component({
  selector: 'app-news-category-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class NewsCategoryEditComponent implements OnInit {
  @Input()
  set options(model: any) {
    this.dateModleInput = model;
  }
  get options(): any {
    return this.dateModleInput;
  }
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<NewsCategoryEditComponent>,
    private changeDetectorRef: ChangeDetectorRef,

    private activatedRoute: ActivatedRoute,
    public coreEnumService: CoreEnumService,
    public newsCategoryService: NewsCategoryService,
    private toastrService: CmsToastrService,

  ) {
    console.log('data:', data);
    if (data) {
      this.id = data.id;
      this.parentId = data.parentId;
    }
    this.optionsFileUpload.onActions = {
      onActionSelect: (model) => this.onActionSelectFile(model),
    };




    const treeConfig: ConfigInterface = {
      baseURL: 'http://localhost:8080/',
      api: {
        listFile: 'api/list',
        uploadFile: 'api/upload',
        downloadFile: 'api/download',
        deleteFile: 'api/remove',
        createFolder: 'api/directory',
        renameFile: 'api/rename',
        searchFiles: 'api/search'
      },
      options: {
        allowFolderDownload: DownloadModeEnum.DOWNLOAD_DISABLED,
        showFilesInsideTree: false
      }
    };

    this.tree = new TreeModel(treeConfig);
    this.node = this.tree.nodes;
  }

  tree: TreeModel;
  node: NodeInterface;
  appLanguage = 'sk';



  
  modalTitle = '';
  private dateModleInput: any;
  loading = new ProgressSpinnerModel();
  uploadedfileName = '';
  uploadedfileKey = '';
  optionsFileUpload=new ComponentOptionFileUploadModel();
  dataModelResult: ErrorExceptionResult<NewsCategoryModel> = new ErrorExceptionResult<NewsCategoryModel>();
  dataModel: NewsCategoryModel = new NewsCategoryModel();
  id = 0;
  parentId = -1;
  ComponentAction = ComponentActionEnum.none;
  @ViewChild('vform', { static: false }) formGroup: FormGroup;


  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();



  // noinspection JSUnusedLocalSymbols
  itemSelected(event: any) {
    console.log(event);
  }

  ngOnInit(): void {

    // get Id
    if (this.id === 0) {
      this.id = Number(
        this.activatedRoute.snapshot.paramMap.get('id')
      );
    }
    if (this.id === 0) {
      this.activatedRoute.queryParams.subscribe((params) => {
        // Defaults to 0 if no query param provided.
        if (params.id && params.id > 0) {
          this.id = +params.id || 0;
        }
      });
    }
    if (this.id === 0) {
      if (this.dateModleInput && this.dateModleInput.id) {
        this.id = this.dateModleInput.id;
      }
    }
    // get Id
    // get parentId
    if (this.parentId === 0) {
      this.parentId = Number(
        this.activatedRoute.snapshot.paramMap.get('parentId')
      );
    }
    if (this.parentId === 0) {
      this.activatedRoute.queryParams.subscribe((params) => {
        // Defaults to 0 if no query param provided.
        if (params.parentId && params.parentId > 0) { this.parentId = +params.parentId || -1; }
      });
    }
    if (this.parentId === 0) {
      if (this.dateModleInput && this.dateModleInput.parentId) {
        this.parentId = this.dateModleInput.parentId;
      }
    }
    // get parentId
    if (this.parentId >= 0) {
      this.ComponentAction = ComponentActionEnum.add;
      this.modalTitle = 'ثبت دسته بندی جدید';
    }
    if (this.id) {
      this.ComponentAction = ComponentActionEnum.edit;
      this.modalTitle = 'ویرایش دسته بندی';
      this.DataGetOneContent();
    }
    if (this.ComponentAction === ComponentActionEnum.none) {
      this.toastrService.typeErrorComponentAction();
    }
    this.getEnumRecordStatus();
  }

  getEnumRecordStatus(): void {
    this.loading.display = true;
    this.coreEnumService.ServiceEnumRecordStatus().subscribe((res) => {
      this.dataModelEnumRecordStatusResult = res;
      this.loading.display = false;
    });
  }




  DataGetOneContent(): void {
    if (this.id <= 0) {
      this.toastrService.typeErrorEditRowIsNull();
      return;
    }

    this.formInfo.FormAlert = 'در دریافت ارسال اطلاعات از سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;
    this.newsCategoryService
      .ServiceGetOneById(this.id)
      .subscribe(
        (next) => {

          this.dataModel = next.Item;
          if (next.IsSuccess) {
            this.modalTitle = this.modalTitle + ' ' + next.Item.Title;
            this.formInfo.FormAlert = '';
          } else {
            this.formInfo.FormAlert = 'برروز خطا';
            this.formInfo.FormError = next.ErrorMessage;
          }
          this.loading.display = false;
        },
        (error) => {
          this.toastrService.typeError(error);
          this.loading.display = false;
        }
      );
  }
  DataAddContent(): void {
    this.formInfo.FormAlert = 'در حال ارسال اطلاعات به سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;
    if (this.parentId > 0) {
      this.dataModel.LinkParentId = this.parentId;
    }
    this.newsCategoryService
      .ServiceAdd(this.dataModel)
      .subscribe(
        (next) => {
          this.formInfo.FormAllowSubmit = true;
          this.dataModelResult = next;
          if (next.IsSuccess) {
            this.formInfo.FormAlert = 'ثبت با موفقت انجام شد';
            this.toastrService.typeSuccessAdd();
          } else {
            this.formInfo.FormAlert = 'برروز خطا';
            this.formInfo.FormError = next.ErrorMessage;
          }
          this.loading.display = false;
        },
        (error) => {
          this.formInfo.FormAllowSubmit = true;
          this.toastrService.typeError(error);
          this.loading.display = false;
        }
      );
  }
  DataEditContent(): void {
    this.formInfo.FormAlert = 'در حال ارسال اطلاعات به سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;
    this.newsCategoryService
      .ServiceEdit(this.dataModel)
      .subscribe(
        (next) => {
          this.formInfo.FormAllowSubmit = true;
          this.dataModelResult = next;
          if (next.IsSuccess) {
            this.formInfo.FormAlert = 'ثبت با موفقت انجام شد';
            this.toastrService.typeSuccessEdit();
          } else {
            this.formInfo.FormAlert = 'برروز خطا';
            this.formInfo.FormError = next.ErrorMessage;
          }
          this.loading.display = false;
        },
        (error) => {
          this.formInfo.FormAllowSubmit = true;
          this.toastrService.typeError(error);
          this.loading.display = false;
        }
      );
  }
  onFormSubmit(): void {
    if (this.formGroup.valid) {
      this.formInfo.FormAllowSubmit = false;
      if (this.ComponentAction === ComponentActionEnum.add) {
        this.DataAddContent();
      }
      if (this.ComponentAction === ComponentActionEnum.edit) {
        this.DataEditContent();
      }

    }
  }
  onFormCancel(): void {
    this.dialogRef.close();
  }
  onActionSelectFile(model: ErrorExceptionResult<FileUploadedModel>): void {
    // console.log('model', model);
    if (model && !model.IsSuccess) {
      // this.message = 'خطا در دریافت عکس کپچا';
      return;
    }
    if (model && model.IsSuccess && model.Item.FileKey) {
      // this.modelTargetSetDto.UploadFileGUID = model.Item.FileKey;
      this.uploadedfileName = model.Item.FileName;
      if (this.uploadedfileKey.length > 0) {
        this.uploadedfileKey = this.uploadedfileKey + ',';
      }
      this.uploadedfileKey = this.uploadedfileKey + model.Item.FileKey;
    }
  }
}
