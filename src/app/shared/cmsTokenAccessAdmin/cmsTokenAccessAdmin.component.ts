import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AuthRenewTokenModel,
  CoreAuthService,
  TokenInfoModel,
} from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/_helpers/services/cmsToastr.service';



@Component({
  selector: 'app-cms-token-access-admin',
  templateUrl: './cmsTokenAccessAdmin.component.html',
  styleUrls: ['./cmsTokenAccessAdmin.component.scss'],
})
export class CmsTokenAccessAdminComponent implements OnInit {

  TokenInfo: TokenInfoModel = new TokenInfoModel();
  loadingStatus = false;
  SiteId: number = 0;
  UserId: number = 0;

  constructor(
    public coreAuthService: CoreAuthService,
    private toastrService: CmsToastrService
  ) {
    this.coreAuthService.CurrentTokenInfoBS.subscribe((value) => {
      this.TokenInfo = value;
    });
  }

  ngOnInit(): void {
    this.coreAuthService.CurrentTokenInfoBSRenew();
  }

  onActionbuttonUserAccessAdminAllowToAllData(): void {
    const AuthModel: AuthRenewTokenModel = new AuthRenewTokenModel();
    const NewToall = !this.TokenInfo.UserAccessAdminAllowToAllData;
    AuthModel.UserAccessAdminAllowToProfessionalData = this.TokenInfo.UserAccessAdminAllowToProfessionalData;
    AuthModel.UserAccessAdminAllowToAllData = NewToall;
    AuthModel.SiteId = this.TokenInfo.SiteId;
    AuthModel.UserId = this.TokenInfo.UserId;
    AuthModel.Lang = this.TokenInfo.Language;

    const title = 'اطلاعات ';
    let message = '';
    if (AuthModel.UserAccessAdminAllowToAllData) {
      message = 'درخواست برای دسترسی به کلیه اطلاعات به سرور ارسال شد';
    } else {
      message = 'درخواست قطع  دسترسی به کل اطلاعات  به سرور ارسال شد';
    }
    this.toastrService.toastr.info(message, title);
    this.loadingStatus = true;
    this.coreAuthService.ServiceRenewToken(AuthModel).subscribe(
      (next) => {
        this.loadingStatus = false;
        if (next.IsSuccess) {
          let title = 'اطلاعات ';
          let message = '';
          if (next.Item.UserAccessAdminAllowToAllData === NewToall) {
            message = 'دسترسی تایید شد';
            this.toastrService.toastr.success(message, title);
          } else {
            message = 'دسترسی  جدید تایید نشد';
            this.toastrService.toastr.warning(message, title);
          }
        } else {
          const title = 'برروز خطا ';
          message = next.ErrorMessage;
          this.toastrService.toastr.error(message, title);
        }
      },
      () => {
      }
    );
  }

  onActionbuttonUserAccessAdminAllowToProfessionalData(): void {
    const AuthModel: AuthRenewTokenModel = new AuthRenewTokenModel();
    const NewToPerf = !this.TokenInfo.UserAccessAdminAllowToProfessionalData;
    AuthModel.UserAccessAdminAllowToProfessionalData = NewToPerf;
    AuthModel.UserAccessAdminAllowToAllData = this.TokenInfo.UserAccessAdminAllowToAllData;
    AuthModel.SiteId = this.TokenInfo.SiteId;
    AuthModel.UserId = this.TokenInfo.UserId;
    AuthModel.Lang = this.TokenInfo.Language;

    const title = 'اطلاعات ';
    let message = '';
    if (AuthModel.UserAccessAdminAllowToAllData) {
      message = 'درخواست برای دسترسی حرفه ایی به سرور ارسال شد';
    } else {
      message = 'درخواست قطع  دسترسی حرفه ایی  به سرور ارسال شد';
    }
    this.toastrService.toastr.info(message, title);
    this.loadingStatus = true;
    this.coreAuthService.ServiceRenewToken(AuthModel).subscribe(
      (next) => {
        this.loadingStatus = false;
        if (next.IsSuccess) {
          const title = 'اطلاعات ';
          if (next.Item.UserAccessAdminAllowToProfessionalData === NewToPerf) {
            const message = 'دسترسی تایید شد';
            this.toastrService.toastr.success(message, title);
          } else {
            const message = 'دسترسی  جدید تایید نشد';
            this.toastrService.toastr.warning(message, title);
          }
        } else {
          const title = 'برروز خطا ';
          const message = next.ErrorMessage;
          this.toastrService.toastr.error(message, title);
        }
      },
      () => {
      }
    );
  }

  onActionbuttonSelectUser(): void {
    if (this.UserId === this.TokenInfo.UserId) {
      const title = 'هشدار';
      const message = 'شناسه درخواستی این کاربر با کاربری که در آن هستید یکسان است';
      this.toastrService.toastr.warning(message, title);
      return;
    }
    const AuthModel: AuthRenewTokenModel = new AuthRenewTokenModel();
    AuthModel.UserAccessAdminAllowToProfessionalData = this.TokenInfo.UserAccessAdminAllowToProfessionalData;
    AuthModel.UserAccessAdminAllowToAllData = this.TokenInfo.UserAccessAdminAllowToAllData;
    AuthModel.SiteId = this.TokenInfo.SiteId;
    AuthModel.UserId = this.UserId;
    AuthModel.Lang = this.TokenInfo.Language;

    const title = 'اطلاعات ';
    const message = 'درخواست تغییر کاربر به سرور ارسال شد';
    this.toastrService.toastr.info(message, title);
    this.loadingStatus = true;
    this.coreAuthService.ServiceRenewToken(AuthModel).subscribe(
      (next) => {
        this.loadingStatus = false;
        if (next.IsSuccess) {
          if (next.Item.UserId === this.UserId) {
            const message = 'دسترسی به کاربر جدید تایید شد';
            this.toastrService.toastr.success(message, title);
          } else {
            const message = 'دسترسی به کاربر جدید تایید نشد';
            this.toastrService.toastr.warning(message, title);
          }
        } else {
          const title = 'برروز خطا ';
          const message = next.ErrorMessage;
          this.toastrService.toastr.error(message, title);
        }
      },
      () => {
      }
    );
  }

  onActionbuttonSelectSite(): void {
    if (this.SiteId === this.TokenInfo.SiteId) {
      const title = 'هشدار';
      const message = 'شناسه این وب سایت با وب سایتی که در آن هستید یکسان است';
      this.toastrService.toastr.warning(message, title);
      return;
    }
    const AuthModel: AuthRenewTokenModel = new AuthRenewTokenModel();
    AuthModel.UserAccessAdminAllowToProfessionalData = this.TokenInfo.UserAccessAdminAllowToProfessionalData;
    AuthModel.UserAccessAdminAllowToAllData = this.TokenInfo.UserAccessAdminAllowToAllData;
    AuthModel.UserId = this.TokenInfo.UserId;
    AuthModel.SiteId = this.SiteId;
    AuthModel.Lang = this.TokenInfo.Language;

    const title = 'اطلاعات ';
    const message = 'درخواست تغییر سایت به سرور ارسال شد';
    this.toastrService.toastr.info(message, title);
    this.loadingStatus = true;
    this.coreAuthService.ServiceRenewToken(AuthModel).subscribe(
      (next) => {
        this.loadingStatus = false;
        if (next.IsSuccess) {
          const title = 'اطلاعات ';
          if (next.Item.SiteId === this.SiteId) {
            const message = 'دسترسی به سایت جدید تایید شد';
            this.toastrService.toastr.success(message, title);
          } else {
            const message = 'دسترسی به سایت جدید تایید نشد';
            this.toastrService.toastr.warning(message, title);
          }
        } else {
          const title = 'برروز خطا ';
          const message = next.ErrorMessage;
          this.toastrService.toastr.error(message, title);
        }
      },
      () => {
      }
    );
  }
}
