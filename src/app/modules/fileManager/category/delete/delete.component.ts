
import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { CoreEnumService, ErrorExceptionResult, FilterModel, FormInfoModel, FileCategoryModel, FileCategoryService } from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';


@Component({
  selector: 'app-file-category-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class FileCategoryDeleteComponent implements OnInit {
  requestId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<FileCategoryDeleteComponent>,
    private activatedRoute: ActivatedRoute,
    private fileCategoryService: FileCategoryService,
    private cmsToastrService: CmsToastrService
  ) {
    if (data) {
      this.requestId = +data.id || 0;
    }


  }
  loading = new ProgressSpinnerModel();
  dataModelResultCategory: ErrorExceptionResult<FileCategoryModel> = new ErrorExceptionResult<FileCategoryModel>();
  dataModelResultCategoryAllData: ErrorExceptionResult<FileCategoryModel> = new ErrorExceptionResult<FileCategoryModel>();
    dataModel: any = {};
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  formInfo: FormInfoModel = new FormInfoModel();
  ngOnInit(): void {

    if (this.requestId <= 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.DataGetOne();
    this.DataGetAll();
  }

  DataGetOne(): void {
    if (this.requestId === 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      return;
    }
    this.formInfo.FormAlert = 'در حال لود اطلاعات';
    this.loading.display = true;
    this.fileCategoryService
      .ServiceGetOneById(this.requestId)
      .subscribe(
        (next) => {
          this.dataModelResultCategory = next;
          if (!next.IsSuccess) {
            this.formInfo.FormAlert = 'برروز خطا';
            this.formInfo.FormError = next.ErrorMessage;
            this.formInfo.FormErrorStatus = true;
            this.cmsToastrService.typeErrorGetOne();
          } else {
            this.formInfo.FormAlert = '';
          }
          this.loading.display = false;
        },
        (error) => {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormErrorStatus = true;
          this.cmsToastrService.typeError(error);
          this.loading.display = false;
        }
      );

  }
  DataGetAll(): void {
    this.formInfo.FormAlert = 'در حال لود اطلاعات';
    const filterModel: FilterModel = new FilterModel();
    filterModel.RowPerPage = 100;
    this.loading.display = true;
    this.fileCategoryService
      .ServiceGetAll(filterModel)
      .subscribe(
        (next) => {
          this.dataModelResultCategoryAllData = next;
          if (!next.IsSuccess) {
            this.formInfo.FormAlert = 'برروز خطا';
            this.formInfo.FormError = next.ErrorMessage;
            this.formInfo.FormErrorStatus = true;
            this.cmsToastrService.typeErrorGetAll();
          } else {
            this.formInfo.FormAlert = '';
          }
          this.loading.display = false;
        },
        (error) => {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormErrorStatus = true;
          this.cmsToastrService.typeError(error);
          this.loading.display = false;
        }
      );

  }
  onFormMove(): void {
    if (this.requestId === 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      return;
    }
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.FormAllowSubmit = true;
    if (this.dataModel.NewCatId === this.requestId) {
      this.formInfo.FormAlert = 'برروز خطا';
      this.formInfo.FormError =
        'شناسه دسته بندی در حال حذف با دسته بندی جایگزین یکسان است';
      this.formInfo.DisabledButtonSubmitted = false;
    }

    this.formInfo.DisabledButtonSubmitted = true;
    this.loading.display = true;
    this.fileCategoryService
      .ServiceMove(this.requestId, this.dataModel.NewCatId)
      .subscribe(
        (next) => {
          if (!next.IsSuccess) {
            this.formInfo.FormAlert = 'برروز خطا';
            this.formInfo.FormError = next.ErrorMessage;
            this.cmsToastrService.typeErrorMove();
          } else {
            this.formInfo.FormAlert = 'جابجایی با موفقیت انجام شد';
            this.cmsToastrService.typeSuccessMove();
          }
          this.formInfo.FormAllowSubmit = true;
          this.formInfo.DisabledButtonSubmitted = false;
          this.loading.display = false;
        },
        (error) => {
          this.formInfo.FormAlert = 'برروز خطا';
          this.cmsToastrService.typeError(error);
          this.formInfo.DisabledButtonSubmitted = false;
          this.formInfo.FormAllowSubmit = true;
          this.loading.display = false;
        }
      );
  }
  onFormDelete(): void {
    if (this.requestId === 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      return;
    }
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.FormAllowSubmit = false;
    this.formInfo.DisabledButtonSubmitted = true;
    this.loading.display = true;
    this.fileCategoryService
      .ServiceDelete(this.requestId)
      .subscribe(
        (next) => {
          this.formInfo.FormAllowSubmit = !next.IsSuccess;
          if (!next.IsSuccess) {
            this.formInfo.FormAlert = 'برروز خطا';
            this.formInfo.FormError = next.ErrorMessage;
            this.cmsToastrService.typeErrorRemove();

          } else {
            this.formInfo.FormAlert = 'حذف با موفقیت انجام شد';
            this.cmsToastrService.typeSuccessRemove();
            this.dialogRef.close({ dialogChangedDate: true });
          }
          this.formInfo.DisabledButtonSubmitted = false;
          this.loading.display = false;
        },
        (error) => {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormAllowSubmit = true;
          this.cmsToastrService.typeError(error);
          this.formInfo.DisabledButtonSubmitted = false;
          this.loading.display = false;
        }
      );

  }
  onFormChangeNewCatId(model: FileCategoryModel): void {
    this.formInfo.FormAlert = '';
    if (this.requestId === 0 || !model || model.Id <= 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      return;
    }
    this.dataModel.NewCatId = model.Id;
    if (this.dataModel.NewCatId === this.requestId) {
      this.formInfo.FormAlert = 'برروز خطا';
      this.formInfo.FormError =
        'شناسه دسته بندی در حال حذف با دسته بندی جایگزین یکسان است';
      this.formInfo.DisabledButtonSubmitted = true;
    } else {
      this.formInfo.DisabledButtonSubmitted = false;
      this.formInfo.FormError = '';
    }
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
    this.loading.display = false;
  }
}
