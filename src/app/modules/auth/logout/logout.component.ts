import { Component, OnInit } from '@angular/core';
import { CoreAuthService } from 'ntk-cms-api';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  constructor(private authService: CoreAuthService) {
    this.authService.ServiceLogout().subscribe();
  }

  ngOnInit(): void {}
}
