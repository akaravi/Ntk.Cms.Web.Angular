import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PagesRouting} from './pages.routing';
import {PagesComponent} from './pages.component';
import {ScriptsInitComponent} from './_layout/init/scipts-init/scripts-init.component';
import {AsideComponent} from './_layout/components/aside/aside.component';
import {AsideDynamicComponent} from './_layout/components/aside-dynamic/aside-dynamic.component';
import {InlineSVGModule} from 'ng-inline-svg';
import {NgbDropdownModule, NgbProgressbarModule} from '@ng-bootstrap/ng-bootstrap';
import {HeaderMenuComponent} from './_layout/components/header/header-menu/header-menu.component';
import {HeaderComponent} from './_layout/components/header/header.component';
import {HeaderMenuDynamicComponent} from './_layout/components/header/header-menu-dynamic/header-menu-dynamic.component';
import {TopbarComponent} from './_layout/components/topbar/topbar.component';
import {LanguageSelectorComponent} from './_layout/components/topbar/language-selector/language-selector.component';
import {HeaderMobileComponent} from './_layout/components/header-mobile/header-mobile.component';
import {ExtrasModule} from '../core/partials/layout/extras/extras.module';
import {TranslationModule} from '../core/i18n/translation.module';
import {CoreModule} from '../core';
import {SubheaderModule} from '../core/partials/layout/subheader/subheader.module';
import {CoreSiteModule} from '../modules/coreMain/site/coreSite.module';
import {CoreAuthService, CoreCpMainMenuService} from 'ntk-cms-api';


@NgModule({
  declarations: [
    PagesComponent,
    ScriptsInitComponent,
    HeaderMobileComponent,
    AsideComponent,
    HeaderComponent,
    HeaderMenuComponent,
    TopbarComponent,
    LanguageSelectorComponent,
    AsideDynamicComponent,
    HeaderMenuDynamicComponent,
  ],
  imports: [
    CommonModule,
    PagesRouting,
    TranslationModule,
    InlineSVGModule,
    ExtrasModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    CoreModule,
    SubheaderModule,
    CoreSiteModule
  ],
  providers: [
    CoreCpMainMenuService,
    CoreAuthService,

  ]
})
export class PagesModule {
}
