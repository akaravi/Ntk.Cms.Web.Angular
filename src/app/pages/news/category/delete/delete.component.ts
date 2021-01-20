
import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { CoreEnumService, ErrorExceptionResult, FilterModel, FormInfoModel, NewsCategoryModel, NewsCategoryService } from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/_helpers/services/cmsToastr.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentOptionSelectorModel } from 'src/app/core/cmsComponentModels/base/componentOptionSelectorModel';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';


@Component({
  selector: 'app-news-category-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class NewsCategoryDeleteComponent implements OnInit {

  @Input()
  set options(model: any) {
    this.dateModleInput = model;
  }
  get options(): any {
    return this.dateModleInput;
  }

  id: any;
  loading = new ProgressSpinnerModel();

  private dateModleInput: any;

  dataModelResultCategory: ErrorExceptionResult<NewsCategoryModel> = new ErrorExceptionResult<NewsCategoryModel>();
  dataModelResultCategoryAllData: ErrorExceptionResult<NewsCategoryModel> = new ErrorExceptionResult<NewsCategoryModel>();
  optionsCategorySelector: ComponentOptionSelectorModel<NewsCategoryModel> = new ComponentOptionSelectorModel<NewsCategoryModel>();

  dataModel: any = {};
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  formInfo: FormInfoModel = new FormInfoModel();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<NewsCategoryDeleteComponent>,
    private activatedRoute: ActivatedRoute,
    private newsCategoryService: NewsCategoryService,
    private toastrService: CmsToastrService
  ) {
    this.optionsCategorySelector.parentMethods = {
      onActionSelect: (x) => this.onFormChangeNewCatId(x),
    };
    this.optionsCategorySelector.data.placeholder = 'دسته بندی جایگزین جهت جابجایی اطلاعات به این  شاخه';
  }
  ngOnInit(): void {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.activatedRoute.queryParams.subscribe((params) => {
      // Defaults to 0 if no query param provided.
      this.id = +params.id || 0;
    });
    if (this.dateModleInput && this.dateModleInput.id) {
      this.id = this.dateModleInput.id;
    }
    if (this.data && typeof this.data.id === 'number' && this.data.id > 0) {
      this.id = this.data.id;
    }
    if (this.id === 0) {
      this.toastrService.typeErrorDeleteRowIsNull();
      return;
    }
    this.DataGetOne();
    this.DataGetAll();
  }

  DataGetOne(): void {
    if (this.id === 0) {
      this.toastrService.typeErrorDeleteRowIsNull();
      return;
    }
    this.formInfo.FormAlert = 'در حال لود اطلاعات';
    this.loading.display = true;
    this.newsCategoryService
      .ServiceGetOneById(this.id)
      .subscribe(
        (next) => {
          this.dataModelResultCategory = next;
          if (!next.IsSuccess) {
            this.formInfo.FormAlert = 'برروز خطا';
            this.formInfo.FormError = next.ErrorMessage;
            this.formInfo.FormErrorStatus = true;
            this.toastrService.typeErrorGetOne();
          } else {
            this.formInfo.FormAlert = '';
          }
          this.loading.display = false;
        },
        (error) => {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormErrorStatus = true;
          this.toastrService.typeError(error);
          this.loading.display = false;
        }
      );

  }
  DataGetAll(): void {
    this.formInfo.FormAlert = 'در حال لود اطلاعات';
    const filterModel: FilterModel = new FilterModel();
    filterModel.RowPerPage = 100;
    this.loading.display = true;
    this.newsCategoryService
      .ServiceGetAll(filterModel)
      .subscribe(
        (next) => {
          this.dataModelResultCategoryAllData = next;
          if (!next.IsSuccess) {
            this.formInfo.FormAlert = 'برروز خطا';
            this.formInfo.FormError = next.ErrorMessage;
            this.formInfo.FormErrorStatus = true;
            this.toastrService.typeErrorGetAll();
          } else {
            this.formInfo.FormAlert = '';
          }
          this.loading.display = false;
        },
        (error) => {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormErrorStatus = true;
          this.toastrService.typeError(error);
          this.loading.display = false;
        }
      );

  }
  onFormMove(): void {
    if (this.id === 0) {
      this.toastrService.typeErrorDeleteRowIsNull();
      return;
    }
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.FormAllowSubmit = true;
    if (this.dataModel.NewCatId === this.id) {
      this.formInfo.FormAlert = 'برروز خطا';
      this.formInfo.FormError =
        'شناسه دسته بندی در حال حذف با دسته بندی جایگزین یکسان است';
      this.formInfo.DisabledButtonSubmitted = false;
    }
    if (this.id === 0) {
      this.toastrService.typeErrorDeleteRowIsNull();
      return;
    }
    this.formInfo.DisabledButtonSubmitted = true;
    this.loading.display = true;
    this.newsCategoryService
      .ServiceMove(this.id, this.dataModel.NewCatId)
      .subscribe(
        (next) => {
          if (!next.IsSuccess) {
            this.formInfo.FormAlert = 'برروز خطا';
            this.formInfo.FormError = next.ErrorMessage;
            this.toastrService.typeErrorMove();
          } else {
            this.formInfo.FormAlert = 'جابجایی با موفقیت انجام شد';
            this.toastrService.typeSuccessMove();
          }
          this.formInfo.FormAllowSubmit = true;
          this.formInfo.DisabledButtonSubmitted = false;
          this.loading.display = false;
        },
        (error) => {
          this.formInfo.FormAlert = 'برروز خطا';
          this.toastrService.typeError(error);
          this.formInfo.DisabledButtonSubmitted = false;
          this.formInfo.FormAllowSubmit = true;
          this.loading.display = false;
        }
      );
  }
  onFormDelete(): void {
    if (this.id === 0) {
      this.toastrService.typeErrorDeleteRowIsNull();
      return;
    }
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.FormAllowSubmit = false;
    if (this.id === 0) {
      this.toastrService.typeErrorDeleteRowIsNull();
      return;
    }
    this.formInfo.DisabledButtonSubmitted = true;
    this.loading.display = true;
    this.newsCategoryService
      .ServiceDelete(this.id)
      .subscribe(
        (next) => {
          this.formInfo.FormAllowSubmit = !next.IsSuccess;
          if (!next.IsSuccess) {
            this.formInfo.FormAlert = 'برروز خطا';
            this.formInfo.FormError = next.ErrorMessage;
            this.toastrService.typeErrorRemove();

          } else {
            this.formInfo.FormAlert = 'حذف با موفقیت انجام شد';
            this.toastrService.typeSuccessRemove();
            this.dialogRef.close({ dialogChangedDate: true });
          }
          this.formInfo.DisabledButtonSubmitted = false;
          this.loading.display = false;
        },
        (error) => {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormAllowSubmit = true;
          this.toastrService.typeError(error);
          this.formInfo.DisabledButtonSubmitted = false;
          this.loading.display = false;
        }
      );

  }
  onFormChangeNewCatId(model: NewsCategoryModel): void {
    this.formInfo.FormAlert = '';
    if (this.id === 0 || !model || model.Id <= 0) {
      this.toastrService.typeErrorDeleteRowIsNull();
      return;
    }
    this.dataModel.NewCatId = model.Id;
    if (this.dataModel.NewCatId === this.id) {
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
