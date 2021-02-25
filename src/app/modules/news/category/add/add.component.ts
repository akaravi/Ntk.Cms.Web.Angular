import {
  CoreEnumService,
  EnumModel,
  ErrorExceptionResult,
  FormInfoModel,
  NewsCategoryService,
  NewsCategoryModel,
  FileUploadedModel,
} from 'ntk-cms-api';
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ChangeDetectorRef,
  Inject,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ComponentActionEnum } from 'src/app/core/helpers/model/component-action-enum';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { ComponentOptionFileUploadModel } from 'src/app/core/cmsComponentModels/files/componentOptionFileUploadModel';
import {
  ConfigInterface,
  DownloadModeEnum,
  TreeModel,
  NodeInterface,
} from 'ntk-cms-filemanager';
import { CmsFormsErrorStateMatcher } from 'src/app/core/pipe/cmsFormsErrorStateMatcher';

@Component({
  selector: 'app-news-category-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class NewsCategoryAddComponent implements OnInit {
  requestParentId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<NewsCategoryAddComponent>,
    private changeDetectorRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    public coreEnumService: CoreEnumService,
    public newsCategoryService: NewsCategoryService,
    private cmsToastrService: CmsToastrService
  ) {
    if (data) {
      this.requestParentId = +data.parentId || 0;
    }

    this.fileManagerTree = new TreeModel();
  }
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];

  fileManagerTree: TreeModel;
  appLanguage = 'fa';
  formMatcher = new CmsFormsErrorStateMatcher();
  formControlRequired = new FormControl('', [
    Validators.required,
  ]);
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<NewsCategoryModel> = new ErrorExceptionResult<NewsCategoryModel>();
  dataModel: NewsCategoryModel = new NewsCategoryModel();

  @ViewChild('vform', { static: false }) formGroup: FormGroup;

  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();

  fileManagerOpenForm = false;
  onActionFileSelected(model: NodeInterface): void {
    this.dataModel.LinkMainImageId = model.id;
    this.dataModel.LinkMainImageIdSrc = model.downloadLinksrc;

  }

  ngOnInit(): void {

      this.formInfo.FormTitle = 'ثبت دسته بندی جدید';
    this.getEnumRecordStatus();
  }

  getEnumRecordStatus(): void {
    this.loading.display = true;
    this.coreEnumService.ServiceEnumRecordStatus().subscribe((res) => {
      this.dataModelEnumRecordStatusResult = res;
      this.loading.display = false;
    });
  }

  
  DataAddContent(): void {
    this.formInfo.FormAlert = 'در حال ارسال اطلاعات به سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;
    if (this.requestParentId > 0) {
      this.dataModel.LinkParentId = this.requestParentId;
    }
    this.newsCategoryService.ServiceAdd(this.dataModel).subscribe(
      (next) => {
        this.formInfo.FormAllowSubmit = true;
        this.dataModelResult = next;
        if (next.IsSuccess) {
          this.formInfo.FormAlert = 'ثبت با موفقیت انجام شد';
          this.cmsToastrService.typeSuccessAdd();
          this.dialogRef.close({ dialogChangedDate: true });
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = next.ErrorMessage;
        }
        this.loading.display = false;
      },
      (error) => {
        this.formInfo.FormAllowSubmit = true;
        this.cmsToastrService.typeError(error);
        this.loading.display = false;
      }
    );
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.FormAllowSubmit = false;
    
      this.DataAddContent();
    
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
