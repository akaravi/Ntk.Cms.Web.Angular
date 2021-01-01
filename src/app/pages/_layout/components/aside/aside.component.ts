import { Location } from '@angular/common';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { LayoutService } from '../../../../_metronic/core';
import { CoreAuthService, CoreCpMainMenuService } from 'ntk-cms-api';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
})
export class AsideComponent implements OnInit {

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

  menuList: any;
  firstChildItem: Array<any> = [];
  secondChildItem: Array<any> = [];
  thirdChildItem: Array<any> = [];

  constructor(
    private layout: LayoutService,
    private loc: Location,
    private coreCpMainMenuService: CoreCpMainMenuService,
    public coreAuthService: CoreAuthService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.menuList = this.activatedRoute.snapshot.data.menuList;
    this.DataGetCpMenu();
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
    this.coreAuthService.CurrentTokenInfoBSObs.subscribe(() => {
      this.DataGetCpMenu();
    });
  }

  private getLogo(): string {
    if (this.brandSkin === 'light') {
      return './assets/media/logos/logo-dark.png';
    } else {
      return './assets/media/logos/logo-light.png';
    }
  }

  DataGetCpMenu(): void {
    this.firstChildItem = [];
    this.secondChildItem = [];
    this.thirdChildItem = [];
    this.coreCpMainMenuService.ServiceGetAllMenu(null).subscribe(
      (next) => {
        if (next.IsSuccess) {
          next.ListItems.forEach((firstRes) => {
            this.firstChildItem.push({ firstTitle: firstRes.Title, parentId: firstRes.Id });
            if (typeof firstRes.Children !== 'undefined') {
              firstRes.Children.forEach((secondRes) => {
                this.secondChildItem.push({
                  secondTitle: secondRes.Title,
                  secondParentId: secondRes.Id,
                  firstChildId: secondRes.LinkParentId
                });
                if (typeof secondRes.Children !== 'undefined' && secondRes.Children.length !== 0) {
                  secondRes.Children.forEach((thirdRes) => {
                    this.thirdChildItem.push({ thirdTitle: thirdRes.Title, secondChildId: thirdRes.LinkParentId });
                  });
                }
              });
            }
          });
        }
      }
    );
    // this.menuList.ListItems.forEach((firstRes) => {
    //   this.firstChildItem.push({firstTitle: firstRes.Title, parentId: firstRes.Id});
    //   if (typeof firstRes.Children !== 'undefined') {
    //     firstRes.Children.forEach((secondRes) => {
    //       this.secondChildItem.push({
    //         secondTitle: secondRes.Title,
    //         secondParentId: secondRes.Id,
    //         firstChildId: secondRes.LinkParentId});
    //       if (typeof secondRes.Children !== 'undefined' && secondRes.Children.length !== 0) {
    //         secondRes.Children.forEach((thirdRes) => {
    //           this.thirdChildItem.push({thirdTitle: thirdRes.Title, secondChildId: thirdRes.LinkParentId});
    //         });
    //       }
    //     });
    //   }
    // });
  }
}
