import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';


import {
  AuthRenewTokenModel,
  CoreAuthService,
  CoreSiteModel,
  CoreSiteService,
  ErrorExceptionResult,
  FilterModel,
  FormInfoModel
} from 'ntk-cms-api';
import {PublicHelper} from '../../../../core/helpers/publicHelper';
import {CmsToastrService} from '../../../../core/services/cmsToastr.service';


@Component({
  selector: 'app-site-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class SelectionComponent implements OnInit {

  subManager = new Subscription();
  filterModel = new FilterModel();
  dataModel: ErrorExceptionResult<CoreSiteModel>;

  constructor(
    private coreAuthService: CoreAuthService,
    private coreSiteService: CoreSiteService,
    private cmsToastrService: CmsToastrService,
    private publicHelper: PublicHelper,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

  }
  formInfo: FormInfoModel = new FormInfoModel();

  ngOnInit(): void {
    this.dataModel = this.activatedRoute.snapshot.data.list;
  }

  clickSelectSite(id: number): void {
    this.formInfo.DisabledButtonSubmitted=true;
    let authModel: AuthRenewTokenModel;
    authModel = new AuthRenewTokenModel();
    authModel.SiteId = id;
    this.subManager.add(
      this.coreAuthService.ServiceRenewToken(authModel).subscribe(
        (res) => {
          if (res.IsSuccess) {
            this.cmsToastrService.typeSuccessSelected()
            this.router.navigate(['/']);
          }
          else
          {
            this.cmsToastrService.typeErrorSelected();
            this.formInfo.DisabledButtonSubmitted=false;
          }
        },
        (error) => {
          this.cmsToastrService.typeError(error);
          this.formInfo.DisabledButtonSubmitted=false;
        }
      )
    );
  }

  onActionAddFirstSite(model: ErrorExceptionResult<any>): void {
    if (model.IsSuccess) {
      let authModel: AuthRenewTokenModel;
      authModel = new AuthRenewTokenModel();
      // authModel.SiteId = model.Id;
      this.subManager.add(
        this.coreAuthService.ServiceRenewToken(authModel).subscribe(
          (next) => {
            if (next.IsSuccess) {
              this.router.navigate([environment.cmsUiConfig.Pathdashboard]);
            }
          },
          (error) => {
            this.cmsToastrService.toastr.error(
              this.publicHelper.CheckError(error),
              'خطا در ورود'
            );
          }
        )
      );
    }
  }
}
