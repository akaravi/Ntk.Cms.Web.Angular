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
  FilterModel
} from 'ntk-cms-api';
import {PublicHelper} from '../../../../core/helpers/services/publicHelper';
import {CmsToastrService} from '../../../../core/helpers/services/cmsToastr.service';


@Component({
  selector: 'app-site-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css']
})
export class SelectionComponent implements OnInit {

  subManager = new Subscription();
  filterModel = new FilterModel();
  dataModel: ErrorExceptionResult<CoreSiteModel>;

  constructor(
    private coreAuthService: CoreAuthService,
    private coreSiteService: CoreSiteService,
    private toastrService: CmsToastrService,
    private publicHelper: PublicHelper,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.dataModel = this.activatedRoute.snapshot.data.list;
  }

  clickSelectSite(id: number): void {
    let AuthModel: AuthRenewTokenModel;
    AuthModel = new AuthRenewTokenModel();
    AuthModel.SiteId = id;
    this.subManager.add(
      this.coreAuthService.ServiceRenewToken(AuthModel).subscribe(
        (res) => {
          if (res.IsSuccess) {
            // localStorage.setItem('userInfo', JSON.stringify( res.Item));
            this.router.navigate(['/']);
          }
        },
        (error) => {
          this.toastrService.typeError(error);
        }
      )
    );
  }

  onActionAddFirstSite(model: ErrorExceptionResult<any>): void {
    if (model.IsSuccess) {
      let AuthModel: AuthRenewTokenModel;
      AuthModel = new AuthRenewTokenModel();
      // AuthModel.SiteId = model.Id;
      this.subManager.add(
        this.coreAuthService.ServiceRenewToken(AuthModel).subscribe(
          (next) => {
            if (next.IsSuccess) {
              this.router.navigate([environment.cmsUiConfig.Pathdashboard]);
            }
          },
          (error) => {
            this.toastrService.toastr.error(
              this.publicHelper.CheckError(error),
              'خطا در ورود'
            );
          }
        )
      );
    }
  }
}
