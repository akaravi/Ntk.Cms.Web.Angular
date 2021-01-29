import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SiteRoutingModule} from './site-routing.module';
import {SiteComponent} from './site.component';
import {CoreModuleService, CoreSiteCategoryModuleService, CoreSiteCategoryService, CoreSiteService} from 'ntk-cms-api';
import {FormsModule} from '@angular/forms';
import {SelectionComponent} from './selection/selection.component';
import {CoreSiteAddFirstComponent} from './addFirst/addFirst.component';
import {SiteResolver} from './site.resolver';
import {LayoutModule} from '../../../pages/layout.module';

@NgModule({
  declarations: [
    SiteComponent,
    CoreSiteAddFirstComponent,
    SelectionComponent,
  ],
    imports: [
        CommonModule,
        FormsModule,
        SiteRoutingModule,
    ],
  providers: [
    CoreSiteService,
    CoreSiteCategoryModuleService,
    CoreModuleService,
    CoreSiteCategoryService,
    SiteResolver
  ]
})
export class SiteModule {
}
