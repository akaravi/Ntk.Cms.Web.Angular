import { Component, OnInit } from '@angular/core';
import { CoreAuthService } from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-auth-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class AuthLogoutComponent implements OnInit {
  constructor(private authService: CoreAuthService,
              private cmsToastrService: CmsToastrService,
  ) {
    this.authService.ServiceLogout().subscribe((next) => {
      if (next.IsSuccess) {
        this.cmsToastrService.typeSuccessLogout();

      }
    });
  }

  ngOnInit(): void { }
}
