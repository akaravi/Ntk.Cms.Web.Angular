import {
  CoreEnumService,
  EnumModel,
  ErrorExceptionResult,
  FormInfoModel,
  ArticleCategoryService,
  ArticleCategoryModel,
} from 'ntk-cms-api';
import {
  Component,
  OnInit,
  ViewChild,
  Inject,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import {
  TreeModel,
  NodeInterface,
} from 'ntk-cms-filemanager';
import { CmsFormsErrorStateMatcher } from 'src/app/core/pipe/cmsFormsErrorStateMatcher';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';

@Component({
  selector: 'app-article-category-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class ArticleCategoryAddComponent implements OnInit {
  requestParentId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cmsStoreService: CmsStoreService,
    private dialogRef: MatDialogRef<ArticleCategoryAddComponent>,

    public coreEnumService: CoreEnumService,
    public articleCategoryService: ArticleCategoryService,
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
  dataModelResult: ErrorExceptionResult<ArticleCategoryModel> = new ErrorExceptionResult<ArticleCategoryModel>();
  dataModel: ArticleCategoryModel = new ArticleCategoryModel();

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

  storeSnapshot = this.cmsStoreService.getStateSnapshot();
  getEnumRecordStatus(): void {
    if (this.storeSnapshot && this.storeSnapshot.EnumRecordStatus && this.storeSnapshot.EnumRecordStatus && this.storeSnapshot.EnumRecordStatus.IsSuccess && this.storeSnapshot.EnumRecordStatus.ListItems && this.storeSnapshot.EnumRecordStatus.ListItems.length > 0) {
      this.dataModelEnumRecordStatusResult = this.storeSnapshot.EnumRecordStatus;
    }
  }

  DataAddContent(): void {
    this.formInfo.FormAlert = 'در حال ارسال اطلاعات به سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;
    if (this.requestParentId > 0) {
      this.dataModel.LinkParentId = this.requestParentId;
    }
    this.articleCategoryService.ServiceAdd(this.dataModel).subscribe(
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
