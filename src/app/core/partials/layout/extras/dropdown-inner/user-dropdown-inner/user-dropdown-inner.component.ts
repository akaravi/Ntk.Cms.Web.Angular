import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LayoutService } from '../../../../..';
import { CoreAuthService, TokenInfoModel } from 'ntk-cms-api';
@Component({
  selector: 'app-user-dropdown-inner',
  templateUrl: './user-dropdown-inner.component.html',
  styleUrls: ['./user-dropdown-inner.component.scss'],
})
export class UserDropdownInnerComponent implements OnInit {
  extrasUserDropdownStyle: 'light' | 'dark' = 'light';
  user$: Observable<TokenInfoModel>;

  constructor(private layout: LayoutService, private auth: CoreAuthService) { }

  ngOnInit(): void {
    this.extrasUserDropdownStyle = this.layout.getProp(
      'extras.user.dropdown.style'
    );
    this.user$ = this.auth.CurrentTokenInfoBS.asObservable();
  }

  logout(): void {
    this.auth.ServiceLogout().subscribe();
    document.location.reload();
  }
}
