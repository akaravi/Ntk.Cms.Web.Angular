import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRouting } from './dashboard.routing';
import { DashboardOneComponent } from './one/one.component';
import { DashboardTwoComponent } from './two/two.component';
import { ApplicationAppWidgetComponent } from 'src/app/modules/application/content/widget/widget.component';
import {
  ApplicationAppService,
  ApplicationMemberInfoService,
  ArticleContentService,
  CoreSiteService,
  CoreUserService,
  NewsContentService
} from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared/shared.module';
import { ApplicationMemberInfoWidgetComponent } from 'src/app/modules/application/memberInfo/widget/widget.component';
import { NewsContentWidgetComponent } from 'src/app/modules/news/content/widget/widget.component';
import { ArticleContentWidgetComponent } from 'src/app/modules/article/content/widget/widget.component';
import { CoreSiteWidgetCountComponent } from 'src/app/modules/coreMain/site/widget/count/widget.component';
import { CoreSiteWidgetStatusComponent } from 'src/app/modules/coreMain/site/widget/status/widget.component';
import { CoreUserWidgetComponent } from 'src/app/modules/coreMain/user/widget/widget.component';
import { CoreSiteWidgetModuleComponent } from 'src/app/modules/coreMain/site/widget/module/widget.component';


@NgModule({
  declarations: [
    DashboardComponent,
    DashboardOneComponent,
    DashboardTwoComponent,
    ApplicationAppWidgetComponent,
    ApplicationMemberInfoWidgetComponent,
    NewsContentWidgetComponent,
    ArticleContentWidgetComponent,
    CoreSiteWidgetCountComponent,
    CoreSiteWidgetStatusComponent,
    CoreSiteWidgetModuleComponent,
    CoreUserWidgetComponent,
  ],

  imports: [
    CommonModule,
    DashboardRouting,
    SharedModule
  ],
  providers: [
    ApplicationAppService,
    ApplicationMemberInfoService,
    NewsContentService,
    ArticleContentService,
    CoreSiteService,
    CoreUserService,
  ]
})
export class DashboardModule { }
