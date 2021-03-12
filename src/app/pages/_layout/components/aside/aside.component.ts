import { Location } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { LayoutService } from '../../../../core';
import { CoreAuthService, CoreCpMainMenuModel, CoreCpMainMenuService, ErrorExceptionResult, NtkCmsApiStoreService } from 'ntk-cms-api';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
})
export class AsideComponent implements OnInit, OnDestroy {
  constructor(
    private layout: LayoutService,
    private loc: Location,
    private coreCpMainMenuService: CoreCpMainMenuService,
    public coreAuthService: CoreAuthService,
    private cmsApiStore: NtkCmsApiStoreService,
  ) {
  }

  @Output() getList = new EventEmitter<any>();
  disableAsideSelfDisplay: boolean;
  headerLogo: string;
  brandSkin: string;
  ulCSSClasses: string;
  location: Location;
  asideMenuHTMLAttributes: any = {};
  asideMenuCSSClasses: string;
  asideMenuDropdown;
  brandClasses: string;
  asideMenuScroll = 1;
  asideSelfMinimizeToggle = false;

  // menuList: any;
  // firstChildItem: Array<any> = [];
  // secondChildItem: Array<any> = [];
  // thirdChildItem: Array<any> = [];
  resultCoreCpMainMenu: ErrorExceptionResult<CoreCpMainMenuModel> = new ErrorExceptionResult<CoreCpMainMenuModel>();
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    // this.menuList = this.activatedRoute.snapshot.data.menuList;

    // load view settings
    this.disableAsideSelfDisplay = this.layout.getProp('aside.self.display') === false;
    this.brandSkin = this.layout.getProp('brand.self.theme');
    this.headerLogo = this.getLogo();
    this.ulCSSClasses = this.layout.getProp('aside_menu_nav');
    this.asideMenuCSSClasses = this.layout.getStringCSSClasses('aside_menu');
    this.asideMenuHTMLAttributes = this.layout.getHTMLAttributes('aside_menu');
    this.asideMenuDropdown = this.layout.getProp('aside.menu.dropdown') ? '1' : '0';
    this.brandClasses = this.layout.getProp('brand');
    this.asideSelfMinimizeToggle = this.layout.getProp('aside.self.minimize.toggle');
    this.asideMenuScroll = this.layout.getProp('aside.menu.scroll') ? 1 : 0;
    this.asideMenuCSSClasses = `${this.asideMenuCSSClasses} ${this.asideMenuScroll === 1 ? 'scroll my-4 ps ps--active-y' : ''}`;
    // Routing
    this.location = this.loc;
    this.DataGetCpMenu();

    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe(() => {
      this.DataGetCpMenu();
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  private getLogo(): string {
    if (this.brandSkin === 'light') {
      return './assets/media/logos/logo-dark.png';
    } else {
      return './assets/media/logos/logo-light.png';
    }
  }

  DataGetCpMenu(): void {
    this.coreCpMainMenuService.ServiceGetAllMenu(null).subscribe(
      (next) => {
        this.resultCoreCpMainMenu = next;
        // this.resultCoreCpMainMenu.ListItems[0].LinkParentId
      }
    );

  }
}
