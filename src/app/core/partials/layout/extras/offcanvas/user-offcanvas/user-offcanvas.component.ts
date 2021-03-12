import { Component, OnDestroy, OnInit } from '@angular/core';
import { LayoutService } from '../../../../..';
import { Observable, Subscription } from 'rxjs';
import { CoreAuthService, NtkCmsApiStoreService, TokenInfoModel } from 'ntk-cms-api';
import { environment } from '../../../../../../../environments/environment';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { map } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';

@Component({
  selector: 'app-user-offcanvas',
  templateUrl: './user-offcanvas.component.html',
  styleUrls: ['./user-offcanvas.component.scss'],
})
export class UserOffcanvasComponent implements OnInit, OnDestroy {

  constructor(
    private layout: LayoutService,
    private auth: CoreAuthService,
    private cmsToastrService: CmsToastrService,
    private cmsApiStore: NtkCmsApiStoreService,

  ) {
    this.tokenInfo = this.cmsApiStore.getStateSnapshot().ntkCmsAPiState.tokenInfo;
    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe((value) => {
      this.tokenInfo = value;
    });
    this.developing = environment.developing;
  }
  extrasUserOffcanvasDirection = 'offcanvas-right';
  tokenInfo: TokenInfoModel;
  loading = new ProgressSpinnerModel();
  developing = false;
  cmsApiStoreSubscribe: Subscription;
  ngOnInit(): void {
    this.extrasUserOffcanvasDirection = `offcanvas-${this.layout.getProp(
      'extras.user.offcanvas.direction'
    )}`;

  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  async logout(): Promise<void> {
    this.loading.display = true;
    this.cmsToastrService.typeOrderActionLogout();
    const retOut = await this.auth.ServiceLogout().pipe(map(next => {
      this.loading.display = false;
      if (next.IsSuccess) {
        this.cmsToastrService.typeSuccessLogout();
      } else {
        this.cmsToastrService.typeErrorLogout();
      }
      return;
    })).toPromise();
    document.location.reload();
  }
}
