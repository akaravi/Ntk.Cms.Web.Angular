import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CoreEnumService, EnumModel, ErrorExceptionResult, FormInfoModel, NewsCategoryModel, NewsContentModel, NewsContentService } from 'ntk-cms-api';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { CmsToastrService } from 'src/app/_helpers/services/cmsToastr.service';
import { ComponentOptionSelectorModel } from 'src/app/core/cmsComponentModels/base/componentOptionSelectorModel';

@Component({
  selector: 'app-news-content-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class NewsContentEditComponent implements OnInit, AfterViewInit {

  // @ViewChild('fromDate', { static: false }) fromDate: ElementRef;
  // @ViewChild('expireDate', { static: false }) expireDate: ElementRef;

  dataModelResult: ErrorExceptionResult<NewsContentModel> = new ErrorExceptionResult<NewsContentModel>();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  optionsCategorySelector: ComponentOptionSelectorModel<NewsCategoryModel> = new ComponentOptionSelectorModel<NewsCategoryModel>();

  loadingStatus = false;
  dataModel: NewsContentModel = new NewsContentModel();
  linkCategoryId: number;
  formInfo: FormInfoModel = new FormInfoModel();
  singUpContentForm: FormGroup;
  theMarker: any;
  model: any;
  lat: any;
  lon: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    public coreEnumService: CoreEnumService,
    private newsContentService: NewsContentService,
    private toasterService: CmsToastrService
  ) {
    this.optionsCategorySelector.parentMethods = {
      onActionSelect: (x) => this.onActionCategorySelect(x),
    };
  }

  id = 0;

  ngOnInit(): void {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    this.singUpContentForm = new FormGroup({
      status: new FormControl(this.dataModel.RecordStatus),
      title: new FormControl(this.dataModel.Title),
      description: new FormControl(this.dataModel.Description),
      tag: new FormControl(null),
      keyWords: new FormControl(null),
      fromDate: new FormControl(this.dataModel.CreatedDate),
      expireDate: new FormControl(this.dataModel.ExpireDate)
    });

    // this.activatedRoute.queryParams.subscribe((params) => {
    //   this.id = +params.id || 0;
    // });
    if (this.id === 0) {
      this.toasterService.typeErrorEditRowIsNull();
      return;
    }
    this.getEnumRecordStatus();
    this.DataGetOneContent();

  }


  ngAfterViewInit(): void {


  }

  getEnumRecordStatus(): void {
    this.coreEnumService.ServiceEnumRecordStatus().subscribe((res) => {
      this.dataModelEnumRecordStatusResult = res;
    });
  }

  onFormSubmit(): void {
    if (this.id === 0) {
      this.toasterService.typeErrorEditRowIsNull();
      return;
    }
    if (this.singUpContentForm.valid) {
      this.formInfo.FormAllowSubmit = false;
      this.DataEditContent();
    }
  }

  DataGetOneContent(): void {
    if (this.id === 0) {
      this.toasterService.typeErrorEditRowIsNull();
      return;
    }

    this.formInfo.FormAlert = 'در دریافت ارسال اطلاعات از سرور';
    this.formInfo.FormError = '';
    this.loadingStatus = true;
    this.newsContentService.ServiceGetOneById(this.id).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.optionsCategorySelector.childMethods.ActionSelectForce(next.Item.LinkCategoryId);
          this.dataModel = next.Item;
          this.formInfo.FormAlert = '';
        } else {
          this.toasterService.typeErrorGetOne(next.ErrorMessage);
        }
        this.loadingStatus = false;
      },
      (error) => {
        this.toasterService.typeError(error);
        this.loadingStatus = false;
      }
    );
  }

  DataEditContent(): void {
    this.dataModel.Title = this.singUpContentForm.get('title').value;
    this.dataModel.Description = this.singUpContentForm.get('description').value;
    // this.dataModel.FromDate = this.FromDate.nativeElement.value;
    // this.dataModel.ExpireDate = this.expireDate.nativeElement.value;
    this.dataModel.RecordStatus = this.singUpContentForm.get('status').value;
    this.dataModel.Geolocationlatitude = this.lat;
    this.dataModel.Geolocationlongitude = this.lon;
    // this.dataModel.Id = this.newsNetwork.model.Id;

    if (this.linkCategoryId <= 0) {
      this.toasterService.toastr.error(
        'دسته بندی را مشخص کنید',
        'دسته بندی اطلاعات مشخص نیست'
      );
      return;
    }
    this.dataModel.LinkCategoryId = 0;
    this.formInfo.FormAlert = 'در حال ارسال اطلاعات به سرور';
    this.formInfo.FormError = '';
    this.loadingStatus = true;
    this.newsContentService
      .ServiceEdit(this.dataModel)
      .subscribe(
        (next) => {
          this.loadingStatus = false;
          this.formInfo.FormAllowSubmit = !next.IsSuccess;
          this.dataModelResult = next;
          if (next.IsSuccess) {
            this.formInfo.FormAlert = 'ویرایش با موفقت انجام شد';
            this.toasterService.typeSuccessEdit();

          } else {

            this.toasterService.typeErrorEdit(next.ErrorMessage);
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

  onActionCategorySelect(model: NewsCategoryModel | null): void {
    if (!model || model.Id <= 0) {
      this.toasterService.toastr.error(
        'دسته بندی را مشخص کنید',
        'دسته بندی اطلاعات مشخص نیست'
      );
      return;
    }
    this.dataModel.LinkCategoryId = model.Id;
  }
  onValueChange(model: any): any {
    return model.value;
  }
}
