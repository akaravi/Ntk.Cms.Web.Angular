import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthRenewTokenModel,
  CoreAuthService,
  TokenInfoModel,
  ntkCmsApiStoreService
} from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';



@Component({
  selector: 'app-cms-token-access',
  templateUrl: './cmsTokenAccess.component.html',
  styleUrls: ['./cmsTokenAccess.component.scss'],
})
export class CmsTokenAccessComponent implements OnInit {

  tokenInfo: TokenInfoModel = new TokenInfoModel();
  loadingStatus = false;
  SiteId: number;
  UserId: number;

  constructor(
    public coreAuthService: CoreAuthService,
    private cmsApiStore: ntkCmsApiStoreService,
    private cmsToastrService: CmsToastrService,
    private router: Router,

  ) {

    this.tokenInfo = this.cmsApiStore.getStateSnapshot().ntkCmsAPiState.tokenInfo;

    if (this.tokenInfo && this.tokenInfo.UserId > 0 && this.tokenInfo.SiteId <= 0) {
      this.router.navigate(['/core/site/selection']);
    }

    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe((value) => {
      this.tokenInfo = value;
      if (this.tokenInfo && this.tokenInfo.UserId > 0 && this.tokenInfo.SiteId <= 0) {
        this.router.navigate(['/core/site/selection']);
      }
    });


  }

  ngOnInit(): void {

  }
  cmsApiStoreSubscribe: Subscription;
  ngOnDestroy() {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  onActionbuttonUserAccessAdminAllowToAllData(): void {
    const authModel: AuthRenewTokenModel = new AuthRenewTokenModel();
    const NewToall = !this.tokenInfo.UserAccessAdminAllowToAllData;
    authModel.UserAccessAdminAllowToProfessionalData = this.tokenInfo.UserAccessAdminAllowToProfessionalData;
    authModel.UserAccessAdminAllowToAllData = NewToall;
    authModel.SiteId = this.tokenInfo.SiteId;
    authModel.UserId = this.tokenInfo.UserId;
    authModel.Lang = this.tokenInfo.Language;

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
    const NewToPerf = !this.tokenInfo.UserAccessAdminAllowToProfessionalData;
    authModel.UserAccessAdminAllowToProfessionalData = NewToPerf;
    authModel.UserAccessAdminAllowToAllData = this.tokenInfo.UserAccessAdminAllowToAllData;
    authModel.SiteId = this.tokenInfo.SiteId;
    authModel.UserId = this.tokenInfo.UserId;
    authModel.Lang = this.tokenInfo.Language;

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
    if (this.UserId === this.tokenInfo.UserId) {
      const title = 'هشدار';
      const message = 'شناسه درخواستی این کاربر با کاربری که در آن هستید یکسان است';
      this.cmsToastrService.toastr.warning(message, title);
      return;
    }
    const authModel: AuthRenewTokenModel = new AuthRenewTokenModel();
    authModel.UserAccessAdminAllowToProfessionalData = this.tokenInfo.UserAccessAdminAllowToProfessionalData;
    authModel.UserAccessAdminAllowToAllData = this.tokenInfo.UserAccessAdminAllowToAllData;
    authModel.SiteId = this.tokenInfo.SiteId;
    authModel.UserId = this.UserId;
    authModel.Lang = this.tokenInfo.Language;

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
    if (this.SiteId === this.tokenInfo.SiteId) {
      const title = 'هشدار';
      const message = 'شناسه این وب سایت با وب سایتی که در آن هستید یکسان است';
      this.cmsToastrService.toastr.warning(message, title);
      return;
    }
    const authModel: AuthRenewTokenModel = new AuthRenewTokenModel();
    authModel.UserAccessAdminAllowToProfessionalData = this.tokenInfo.UserAccessAdminAllowToProfessionalData;
    authModel.UserAccessAdminAllowToAllData = this.tokenInfo.UserAccessAdminAllowToAllData;
    authModel.UserId = this.tokenInfo.UserId;
    authModel.SiteId = this.SiteId;
    authModel.Lang = this.tokenInfo.Language;

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
