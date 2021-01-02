
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { CoreEnumService, ErrorExceptionResult, FilterModel, FormInfoModel, NewsCategoryModel, NewsCategoryService } from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/_helpers/services/cmsToastr.service';


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

  private dateModleInput: any;

  dataModelResultCategory: ErrorExceptionResult<NewsCategoryModel> = new ErrorExceptionResult<NewsCategoryModel>();
  dataModelResultCategoryAllData: ErrorExceptionResult<NewsCategoryModel> = new ErrorExceptionResult<NewsCategoryModel>();

  dataModel: any = {};
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  formInfo: FormInfoModel = new FormInfoModel();
  constructor(
    private activatedRoute: ActivatedRoute,
    private newsCategoryService: NewsCategoryService,
    private toastrService: CmsToastrService
  ) { }
  ngOnInit(): void {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.activatedRoute.queryParams.subscribe((params) => {
      // Defaults to 0 if no query param provided.
      this.id = +params.id || 0;
    });
    if (this.dateModleInput && this.dateModleInput.id) {
      this.id = this.dateModleInput.id;
    }
    if (this.id === 0) {
      this.toastrService.typeErrorDeleteRowIsNull();
      return;
    }
    this.DataGetOne();
    this.DataGetAll();
  }

  DataGetOne(): void {

    this.formInfo.FormAlert = 'در حال لود اطلاعات';
    this.newsCategoryService
      .ServiceGetOneById(this.id)
      .subscribe(
        (next) => {
          this.dataModelResultCategory = next;
          if (!next.IsSuccess) {
            this.formInfo.FormAlert = 'برروز خطا';
            this.formInfo.FormError = next.ErrorMessage;
            this.formInfo.FormErrorStatus = true;
          } else {
            this.formInfo.FormAlert = '';
          }
        },
        (error) => {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormErrorStatus = true;
          this.toastrService.typeError(error);
        }
      );

  }
  DataGetAll(): void {

    this.formInfo.FormAlert = 'در حال لود اطلاعات';
    const filterModel: FilterModel = new FilterModel();
    filterModel.RowPerPage = 100;
    this.newsCategoryService
      .ServiceGetAll(filterModel)
      .subscribe(
        (next) => {
          this.dataModelResultCategoryAllData = next;
          if (!next.IsSuccess) {
            this.formInfo.FormAlert = 'برروز خطا';
            this.formInfo.FormError = next.ErrorMessage;
            this.formInfo.FormErrorStatus = true;
          } else {
            this.formInfo.FormAlert = '';
          }
        },
        (error) => {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormErrorStatus = true;
          this.toastrService.typeError(error);
        }
      );

  }
  onFormMove(): void {
    if (this.id === 0) {
      this.toastrService.typeErrorDeleteRowIsNull();
      return;
    }
    if (this.formGroup.valid) {
      this.formInfo.FormAllowSubmit = true;
      if (this.dataModel.NewCatId === this.id) {
        this.formInfo.FormAlert = 'برروز خطا';
        this.formInfo.FormError =
          'شناسه دسته بندی در حال حذف با دسته بندی جایگزین یکسان است';
        this.formInfo.DisabledButtonSubmitted = false;
      }
      this.DataMove();
    }
  }
  onFormDelete(): void {
    if (this.id === 0) {
      this.toastrService.typeErrorDeleteRowIsNull();
      return;
    }
    if (this.formGroup.valid) {
      this.formInfo.FormAllowSubmit = false;
      this.DataDelete();
    }
  }
  onFormChangeNewCatId(): void {
    if (this.id === 0) {
      this.toastrService.typeErrorDeleteRowIsNull();
      return;
    }
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
  DataDelete(): void {
    if (this.id === 0) {
      this.toastrService.typeErrorDeleteRowIsNull();
      return;
    }
    this.formInfo.DisabledButtonSubmitted = true;

    this.newsCategoryService
      .ServiceDelete(this.id)
      .subscribe(
        (next) => {
          this.formInfo.FormAllowSubmit = !next.IsSuccess;
          if (!next.IsSuccess) {
            this.formInfo.FormAlert = 'برروز خطا';
            this.formInfo.FormError = next.ErrorMessage;

          } else {
            this.formInfo.FormAlert = 'حذف با موفقیت انجام شد';
          }
          this.formInfo.DisabledButtonSubmitted = false;

        },
        (error) => {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormAllowSubmit = true;
          this.toastrService.typeError(error);
          this.formInfo.DisabledButtonSubmitted = false;

        }
      );
  }
  DataMove(): void {
    if (this.id === 0) {
      this.toastrService.typeErrorDeleteRowIsNull();
      return;
    }
    this.formInfo.DisabledButtonSubmitted = true;
    this.newsCategoryService
      .ServiceMove(this.id, this.dataModel.NewCatId)
      .subscribe(
        (next) => {
          if (!next.IsSuccess) {
            this.formInfo.FormAlert = 'برروز خطا';
            this.formInfo.FormError = next.ErrorMessage;
          } else {
            this.formInfo.FormAlert = 'جابجایی با موفقیت انجام شد';
          }
          this.formInfo.FormAllowSubmit = false;
          this.formInfo.DisabledButtonSubmitted = false;
        },
        (error) => {
          this.formInfo.FormAlert = 'برروز خطا';
          this.toastrService.typeError(error);
          this.formInfo.DisabledButtonSubmitted = false;
          this.formInfo.FormAllowSubmit = true;
        }
      );
  }

}
