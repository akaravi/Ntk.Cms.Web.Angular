import {Component, Input, OnInit} from '@angular/core';
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
  FilterModel
} from 'ntk-cms-api';
import {environment} from '../../../../../environments/environment';
import {Router} from '@angular/router';
import {CmsToastrService} from '../../../../core/helpers/services/cmsToastr.service';
import {PublicHelper} from '../../../../core/helpers/services/publicHelper';


@Component({
  selector: 'app-core-site-add-first',
  templateUrl: './addFirst.component.html',
  styleUrls: ['./addFirst.component.css']
})
export class CoreSiteAddFirstComponent implements OnInit {

  dataModel = new CoreSiteAddFirstSiteDtoModel();
  dataModelResultCategory: ErrorExceptionResult<CoreSiteCategoryModel>;
  filterModel = new FilterModel();
  dataModelLoad = false;
  dataModelResultDomains = new ErrorExceptionResult<DomainModel>();
  captchaModel: CaptchaModel = new CaptchaModel();
  private dateModleInput: any;

  @Input()
  set dateInput(model: any) {
    this.dateModleInput = model;
  }

  get dateInput(): any {
    return this.dateModleInput;
  }

  constructor(
    private toasterService: CmsToastrService,
    private publicHelper: PublicHelper,
    private coreSiteService: CoreSiteService,
    private coreSiteCategoryModuleService: CoreSiteCategoryModuleService,
    private coreAuthService: CoreAuthService,
    private coreModuleService: CoreModuleService,
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
        this.toasterService.toastr.error(
          this.publicHelper.CheckError(error),
          'خطا در دریافت اطلاعات وب سایتها'
        );
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
        this.toasterService.toastr.error(
          this.publicHelper.CheckError(error),
          'خطا در دریافت لیست دامنه های قابل استفاده'
        );
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
        this.toasterService.typeError(error, 'خطا در دریافت عکس کپچا');
      }
    );

  }

  onClickAddSite(): void {

    this.dataModel.CaptchaKey = this.captchaModel.Key;

    this.coreSiteService.ServiceAddFirstSite(this.dataModel).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.clickSelectSite(next.Item.Id);
        } else {
          this.toasterService.typeErrorAdd(next.ErrorMessage);
        }

      },
      (error) => {
        this.toasterService.toastr.error(
          this.publicHelper.CheckError(error),
          'خطا در ساخت وب سایت'
        );
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
        this.toasterService.typeError(error);
      }
    );
  }
}
