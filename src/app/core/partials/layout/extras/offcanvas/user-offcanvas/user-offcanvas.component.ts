import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../../..';
import { Observable } from 'rxjs';
import { CoreAuthService, TokenInfoModel } from 'ntk-cms-api';
import { environment } from '../../../../../../../environments/environment';

@Component({
  selector: 'app-user-offcanvas',
  templateUrl: './user-offcanvas.component.html',
  styleUrls: ['./user-offcanvas.component.scss'],
})
export class UserOffcanvasComponent implements OnInit {
  extrasUserOffcanvasDirection = 'offcanvas-right';
  user$: Observable<TokenInfoModel>;

  constructor(private layout: LayoutService, private auth: CoreAuthService) {
    this.developing = environment.developing;
  }
  developing = false;
  ngOnInit(): void {
    this.extrasUserOffcanvasDirection = `offcanvas-${this.layout.getProp(
      'extras.user.offcanvas.direction'
    )}`;
    this.user$ = this.auth.CurrentTokenInfoBS.asObservable();
  }

  logout(): void {
    this.auth.ServiceLogout().subscribe();
    document.location.reload();
  }
}
