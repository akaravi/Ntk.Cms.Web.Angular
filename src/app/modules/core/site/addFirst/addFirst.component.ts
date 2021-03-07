import { Component, OnInit } from '@angular/core';
import {
  AuthRenewTokenModel,
  CaptchaModel,
  CoreAuthService,
  CoreModuleService,
  CoreSiteAddFirstSiteDtoModel,
  CoreSiteCategoryModel,
  CoreSiteCategoryModuleService,
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


@Component({
  selector: 'app-core-site-add-first',
  templateUrl: './addFirst.component.html',
  styleUrls: ['./addFirst.component.scss']
})
export class CoreSiteAddFirstComponent implements OnInit {

  dataModel = new CoreSiteAddFirstSiteDtoModel();
  dataModelResultCategory: ErrorExceptionResult<CoreSiteCategoryModel>;
  filterModel = new FilterModel();
  dataModelResultDomains = new ErrorExceptionResult<DomainModel>();
  captchaModel: CaptchaModel = new CaptchaModel();
  formInfo: FormInfoModel = new FormInfoModel();

  constructor(
    private cmsToastrService: CmsToastrService,
    private publicHelper: PublicHelper,
    private coreSiteService: CoreSiteService,
    private coreAuthService: CoreAuthService,
    private coreSiteCategoryService: CoreSiteCategoryService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.CoreSiteCategoryGetAll();
    this.GetDomainList();

    this.onCaptchaOrder();
  }

  CoreSiteCategoryGetAll(): void {
    this.coreSiteCategoryService.ServiceGetAll(this.filterModel).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelResultCategory = next;
        }
      },
      (error) => {
        this.cmsToastrService.typeError(error);
      }
    );
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
      this.cmsToastrService.typeErrorMessage("نوع سامانه انتخاب نشد است");
      return;
    }
    if (this.dataModel.Title.length === 0) {
      this.cmsToastrService.typeErrorMessage("عنوان سامانه انتخاب نشد است");
      return;
    }
    if (this.dataModel.Domain.length === 0) {
      this.cmsToastrService.typeErrorMessage("دامنه سامانه انتخاب نشد است");
      return;
    }
    if (this.dataModel.SubDomain.length === 0) {
      this.cmsToastrService.typeErrorMessage(" دامنه والد سامانه انتخاب نشد است");
      return;
    }
    this.coreSiteService.ServiceAddFirstSite(this.dataModel).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.cmsToastrService.typeSuccessAddFirstSite();
          this.clickSelectSite(next.Item.Id);
        } else {
          this.cmsToastrService.typeErrorAdd(next.ErrorMessage);
        }
      },
      (error) => {
        this.cmsToastrService.typeError(error);
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
          this.router.navigate([environment.cmsUiConfig.Pathdashboard]);
        }
      },
      (error) => {
        this.cmsToastrService.typeError(error);
      }
    );
  }
}
