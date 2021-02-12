import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LayoutService } from '../../../../..';
import { CoreAuthService, ntkCmsApiStoreService, TokenInfoModel } from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-user-dropdown-inner',
  templateUrl: './user-dropdown-inner.component.html',
  styleUrls: ['./user-dropdown-inner.component.scss'],
})
export class UserDropdownInnerComponent implements OnInit {
  extrasUserDropdownStyle: 'light' | 'dark' = 'light';
  TokenInfo: TokenInfoModel;

  constructor(private layout: LayoutService,
    private cmsApiStore :ntkCmsApiStoreService,

              private auth: CoreAuthService,
              private toasterService: CmsToastrService,
  ) { }

  ngOnInit(): void {
    this.extrasUserDropdownStyle = this.layout.getProp(
      'extras.user.dropdown.style'
    );

      this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe((value) => {
        debugger

        this.TokenInfo = value;
      });
  }

  async logout(): Promise<void> {
    const retOut = await this.auth.ServiceLogout().pipe(map(next => {
      if (next.IsSuccess) {
        this.toasterService.typeSuccessLogout();
      } else {
        this.toasterService.typeErrorLogout();
      }
      return;
    })).toPromise();
    document.location.reload();
  }
}
