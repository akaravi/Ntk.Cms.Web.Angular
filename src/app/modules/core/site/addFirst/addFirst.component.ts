import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AuthRenewTokenModel,
  CaptchaModel,
  CoreAuthService,
  CoreSiteAddFirstSiteDtoModel,
  CoreSiteCategoryModel,
  CoreSiteCategoryService,
  CoreSiteService,
  DomainModel, ErrorExceptionResult,
  FilterModel,
  FormInfoModel
} from 'ntk-cms-api';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { CmsToastrService } from '../../../../core/services/cmsToastr.service';
import { PublicHelper } from '../../../../core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-core-site-add-first',
  templateUrl: './addFirst.component.html',
  styleUrls: ['./addFirst.component.scss']
})
export class CoreSiteAddFirstComponent implements OnInit {

  constructor(
    private cmsToastrService: CmsToastrService,
    private coreSiteService: CoreSiteService,
    private coreAuthService: CoreAuthService,
    private coreSiteCategoryService: CoreSiteCategoryService,
    private router: Router
  ) {

  }
  loading = new ProgressSpinnerModel();
  @ViewChild('vform', { static: false }) formGroup: FormGroup;

  dataModel = new CoreSiteAddFirstSiteDtoModel();
  filterModel = new FilterModel();
  dataModelResultDomains = new ErrorExceptionResult<DomainModel>();
  captchaModel: CaptchaModel = new CaptchaModel();
  formInfo: FormInfoModel = new FormInfoModel();
  modelDateSiteCategory = new CoreSiteCategoryModel();

  ngOnInit(): void {
    this.GetDomainList();
    this.onCaptchaOrder();
  }

  GetDomainList(): void {
    this.coreSiteService.ServiceDomains(0).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelResultDomains = next;
        }
      },
      (error) => {
        this.cmsToastrService.typeError(error);
      }
    );
  }

  protocolSelect(): void {
  }

  domain(item): void {
    this.dataModel.Domain = item;
  }

  onCaptchaOrder(): void {
    this.dataModel.CaptchaText = '';
    this.coreAuthService.ServiceCaptcha().subscribe(
      (next) => {
        this.captchaModel = next.Item;
      },
      (error) => {
        this.cmsToastrService.typeError(error, 'خطا در دریافت عکس کپچا');
      }
    );

  }
  onFormSubmit(): void {
    this.dataModel.CaptchaKey = this.captchaModel.Key;
    if (this.dataModel.LinkSiteCategoryId <= 0) {
      this.cmsToastrService.typeErrorMessage('نوع سامانه انتخاب نشد است');
      return;
    }
    if (!this.dataModel.Title || this.dataModel.Title.length === 0) {
      this.cmsToastrService.typeErrorMessage('عنوان سامانه انتخاب نشد است');
      return;
    }
    if (!this.dataModel.Domain || this.dataModel.Domain.length === 0) {
      this.cmsToastrService.typeErrorMessage('دامنه سامانه انتخاب نشد است');
      return;
    }
    if (!this.dataModel.SubDomain || this.dataModel.SubDomain.length === 0) {
      this.cmsToastrService.typeErrorMessage(' دامنه والد سامانه انتخاب نشد است');
      return;
    }
    if (!this.dataModel.CaptchaText || this.dataModel.CaptchaText.length === 0) {
      this.cmsToastrService.typeErrorMessage(' محتوای عکس کپجا وارد نشد است');
      return;
    }
    this.formInfo.FormSubmitAllow = false;
    this.coreSiteService.ServiceAddFirstSite(this.dataModel).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.cmsToastrService.typeSuccessAddFirstSite();
          this.clickSelectSite(next.Item.Id);
        } else {
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorAdd(next.ErrorMessage);
        }
      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.formInfo.FormSubmitAllow = true;
      }
    );
  }

  clickSelectSite(Id: number): void {
    let authModel: AuthRenewTokenModel;
    authModel = new AuthRenewTokenModel();
    authModel.SiteId = Id;
    this.coreAuthService.ServiceRenewToken(authModel).subscribe(
      (res) => {
        if (res.IsSuccess) {
          setTimeout(() => this.router.navigate([environment.cmsUiConfig.Pathdashboard]), 100);
        } else {
          this.onCaptchaOrder();
        }
      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.onCaptchaOrder()
      }
    );
  }
  onActionCategorySelect(model: CoreSiteCategoryModel | null): void {
    if (!model || model.Id <= 0) {
      this.cmsToastrService.toastr.error(
        'نوع سامانه را مشخص کنید',
        'نوع سامانه اطلاعات مشخص نیست'
      );
      return;
    }
    this.modelDateSiteCategory = model;
    this.dataModel.LinkSiteCategoryId = model.Id;
  }
  onStepClick(event: StepperSelectionEvent, stepper: MatStepper): void {
    if (event.previouslySelectedIndex < event.selectedIndex) {
      if (!this.formGroup.valid) {
        this.cmsToastrService.typeErrorFormInvalid();
        setTimeout(() => {
          stepper.selectedIndex = event.previouslySelectedIndex;
          // stepper.previous();
        }, 10);
      }
      if (!this.dataModel.LinkSiteCategoryId || this.dataModel.LinkSiteCategoryId <= 0) {
        this.cmsToastrService.typeErrorMessage('نوع سامانه انتخاب نشده است');
        setTimeout(() => {
          stepper.selectedIndex = event.previouslySelectedIndex;
          // stepper.previous();
        }, 10);
      }
    }
  }
}
