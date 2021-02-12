import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthRenewTokenModel,
  CoreAuthService,
  TokenInfoModel,
  ntkCmsApiStoreService
} from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';



@Component({
  selector: 'app-cms-token-access-admin',
  templateUrl: './cmsTokenAccessAdmin.component.html',
  styleUrls: ['./cmsTokenAccessAdmin.component.scss'],
})
export class CmsTokenAccessAdminComponent implements OnInit {

  TokenInfo: TokenInfoModel = new TokenInfoModel();
  loadingStatus = false;
  SiteId: number;
  UserId: number;

  constructor(
    public coreAuthService: CoreAuthService,
    private cmsApiStore :ntkCmsApiStoreService,
    private cmsToastrService: CmsToastrService,
    private router: Router,

  ) {

    this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe((value) => {
      this.TokenInfo = value;
      if (this.TokenInfo && this.TokenInfo.UserId > 0 && this.TokenInfo.SiteId <= 0) {
        this.router.navigate(['/site/selection']);
      }
    });
  }

  ngOnInit(): void {
   
  }

  onActionbuttonUserAccessAdminAllowToAllData(): void {
    const authModel: AuthRenewTokenModel = new AuthRenewTokenModel();
    const NewToall = !this.TokenInfo.UserAccessAdminAllowToAllData;
    authModel.UserAccessAdminAllowToProfessionalData = this.TokenInfo.UserAccessAdminAllowToProfessionalData;
    authModel.UserAccessAdminAllowToAllData = NewToall;
    authModel.SiteId = this.TokenInfo.SiteId;
    authModel.UserId = this.TokenInfo.UserId;
    authModel.Lang = this.TokenInfo.Language;

    const title = 'اطلاعات ';
    let message = '';
    if (authModel.UserAccessAdminAllowToAllData) {
      message = 'درخواست برای دسترسی به کلیه اطلاعات به سرور ارسال شد';
    } else {
      message = 'درخواست قطع  دسترسی به کل اطلاعات  به سرور ارسال شد';
    }
    this.cmsToastrService.toastr.info(message, title);
    this.loadingStatus = true;
    this.coreAuthService.ServiceRenewToken(authModel).subscribe(
      (next) => {
        this.loadingStatus = false;
        if (next.IsSuccess) {
          const title = 'اطلاعات ';
          let message = '';
          if (next.Item.UserAccessAdminAllowToAllData === NewToall) {
            message = 'دسترسی تایید شد';
            this.cmsToastrService.toastr.success(message, title);
          } else {
            message = 'دسترسی  جدید تایید نشد';
            this.cmsToastrService.toastr.warning(message, title);
          }
        } else {
          this.cmsToastrService.typeErrorAccessChange(next.ErrorMessage);
        }
      },
      (error) => {
        this.cmsToastrService.typeErrorAccessChange(error);
      }
    );
  }

  onActionbuttonUserAccessAdminAllowToProfessionalData(): void {
    const authModel: AuthRenewTokenModel = new AuthRenewTokenModel();
    const NewToPerf = !this.TokenInfo.UserAccessAdminAllowToProfessionalData;
    authModel.UserAccessAdminAllowToProfessionalData = NewToPerf;
    authModel.UserAccessAdminAllowToAllData = this.TokenInfo.UserAccessAdminAllowToAllData;
    authModel.SiteId = this.TokenInfo.SiteId;
    authModel.UserId = this.TokenInfo.UserId;
    authModel.Lang = this.TokenInfo.Language;

    const title = 'اطلاعات ';
    let message = '';
    if (authModel.UserAccessAdminAllowToProfessionalData) {
      message = 'درخواست برای دسترسی حرفه ایی به سرور ارسال شد';
    } else {
      message = 'درخواست قطع  دسترسی حرفه ایی  به سرور ارسال شد';
    }
    this.cmsToastrService.toastr.info(message, title);
    this.loadingStatus = true;
    this.coreAuthService.ServiceRenewToken(authModel).subscribe(
      (next) => {
        this.loadingStatus = false;
        if (next.IsSuccess) {
          const title = 'اطلاعات ';
          if (next.Item.UserAccessAdminAllowToProfessionalData === NewToPerf) {
            const message = 'دسترسی تایید شد';
            this.cmsToastrService.toastr.success(message, title);
          } else {
            const message = 'دسترسی  جدید تایید نشد';
            this.cmsToastrService.toastr.warning(message, title);
          }
        } else {
          this.cmsToastrService.typeErrorAccessChange(next.ErrorMessage);
        }
      },
      (error) => {
        this.cmsToastrService.typeErrorAccessChange(error);
      }
    );
  }

  onActionbuttonSelectUser(): void {
    if (this.UserId === this.TokenInfo.UserId) {
      const title = 'هشدار';
      const message = 'شناسه درخواستی این کاربر با کاربری که در آن هستید یکسان است';
      this.cmsToastrService.toastr.warning(message, title);
      return;
    }
    const authModel: AuthRenewTokenModel = new AuthRenewTokenModel();
    authModel.UserAccessAdminAllowToProfessionalData = this.TokenInfo.UserAccessAdminAllowToProfessionalData;
    authModel.UserAccessAdminAllowToAllData = this.TokenInfo.UserAccessAdminAllowToAllData;
    authModel.SiteId = this.TokenInfo.SiteId;
    authModel.UserId = this.UserId;
    authModel.Lang = this.TokenInfo.Language;

    const title = 'اطلاعات ';
    const message = 'درخواست تغییر کاربر به سرور ارسال شد';
    this.cmsToastrService.toastr.info(message, title);
    this.loadingStatus = true;
    this.coreAuthService.ServiceRenewToken(authModel).subscribe(
      (next) => {
        this.loadingStatus = false;
        if (next.IsSuccess) {
          if (next.Item.UserId === this.UserId) {
            const message = 'دسترسی به کاربر جدید تایید شد';
            this.cmsToastrService.toastr.success(message, title);
          } else {
            const message = 'دسترسی به کاربر جدید تایید نشد';
            this.cmsToastrService.toastr.warning(message, title);
          }
        } else {
          this.cmsToastrService.typeErrorAccessChange(next.ErrorMessage);
        }
      },
      (error) => {
        this.cmsToastrService.typeErrorAccessChange(error);
      }
    );
  }

  onActionbuttonSelectSite(): void {
    if (this.SiteId === this.TokenInfo.SiteId) {
      const title = 'هشدار';
      const message = 'شناسه این وب سایت با وب سایتی که در آن هستید یکسان است';
      this.cmsToastrService.toastr.warning(message, title);
      return;
    }
    const authModel: AuthRenewTokenModel = new AuthRenewTokenModel();
    authModel.UserAccessAdminAllowToProfessionalData = this.TokenInfo.UserAccessAdminAllowToProfessionalData;
    authModel.UserAccessAdminAllowToAllData = this.TokenInfo.UserAccessAdminAllowToAllData;
    authModel.UserId = this.TokenInfo.UserId;
    authModel.SiteId = this.SiteId;
    authModel.Lang = this.TokenInfo.Language;

    const title = 'اطلاعات ';
    const message = 'درخواست تغییر سایت به سرور ارسال شد';
    this.cmsToastrService.toastr.info(message, title);
    this.loadingStatus = true;
    this.coreAuthService.ServiceRenewToken(authModel).subscribe(
      (next) => {
        this.loadingStatus = false;
        if (next.IsSuccess) {
          const title = 'اطلاعات ';
          if (next.Item.SiteId === this.SiteId) {
            const message = 'دسترسی به سایت جدید تایید شد';
            this.cmsToastrService.toastr.success(message, title);
          } else {
            const message = 'دسترسی به سایت جدید تایید نشد';
            this.cmsToastrService.toastr.warning(message, title);
          }
        } else {
          this.cmsToastrService.typeErrorAccessChange(next.ErrorMessage);
        }
      },
      (error) => {
        this.cmsToastrService.typeErrorAccessChange(error);
      }
    );
  }
}
