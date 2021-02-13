import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SiteRouting} from './site.routing';
import {SiteComponent} from './site.component';
import {CoreModuleService, CoreSiteCategoryModuleService, CoreSiteCategoryService, CoreSiteService} from 'ntk-cms-api';
import {FormsModule} from '@angular/forms';
import {SelectionComponent} from './selection/selection.component';
import {CoreSiteAddFirstComponent} from './addFirst/addFirst.component';
import {SiteResolver} from './site.resolver';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    SiteComponent,
    CoreSiteAddFirstComponent,
    SelectionComponent,
  ],
    imports: [
        CommonModule,
        FormsModule,
        SiteRouting,
        SharedModule.forRoot(),

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
