import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../../..';
import { Observable } from 'rxjs';
import { CoreAuthService, TokenInfoModel } from 'ntk-cms-api';
import { environment } from '../../../../../../../environments/environment';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-offcanvas',
  templateUrl: './user-offcanvas.component.html',
  styleUrls: ['./user-offcanvas.component.scss'],
})
export class UserOffcanvasComponent implements OnInit {
  extrasUserOffcanvasDirection = 'offcanvas-right';
  user$: Observable<TokenInfoModel>;

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
