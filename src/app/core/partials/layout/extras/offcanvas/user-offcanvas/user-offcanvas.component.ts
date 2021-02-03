import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../../..';
import { Observable } from 'rxjs';
import { CoreAuthService, TokenInfoModel } from 'ntk-cms-api';
import { environment } from '../../../../../../../environments/environment';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { map } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';

@Component({
  selector: 'app-user-offcanvas',
  templateUrl: './user-offcanvas.component.html',
  styleUrls: ['./user-offcanvas.component.scss'],
})
export class UserOffcanvasComponent implements OnInit {
  extrasUserOffcanvasDirection = 'offcanvas-right';
  user$: Observable<TokenInfoModel>;
  loading = new ProgressSpinnerModel();

  constructor(private layout: LayoutService, private auth: CoreAuthService,
    private toasterService: CmsToastrService,
  ) {

    this.developing = environment.developing;
  }
  developing = false;
  ngOnInit(): void {
    this.extrasUserOffcanvasDirection = `offcanvas-${this.layout.getProp(
      'extras.user.offcanvas.direction'
    )}`;
    this.user$ = this.auth.CurrentTokenInfoBS.asObservable();
  }

  async logout(): Promise<void> {
    this.loading.display = true;
    this.toasterService.typeOrderActionLogout();
    const retOut = await this.auth.ServiceLogout().pipe(map(next => {
      this.loading.display = false;
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
