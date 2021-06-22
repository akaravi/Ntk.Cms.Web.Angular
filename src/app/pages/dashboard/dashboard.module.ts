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
  ChartContentService,
  CoreSiteService,
  CoreUserService,
  NewsContentService
} from 'ntk-cms-api';
import { SharedModule } from 'src/app/shared/shared.module';
import { ApplicationMemberInfoWidgetComponent } from 'src/app/modules/application/memberInfo/widget/widget.component';
import { NewsContentWidgetComponent } from 'src/app/modules/news/content/widget/widget.component';
import { ArticleContentWidgetComponent } from 'src/app/modules/article/content/widget/widget.component';
import { CoreSiteWidgetCountComponent } from 'src/app/modules/core-main/site/widget/count/widget.component';
import { CoreSiteWidgetStatusComponent } from 'src/app/modules/core-main/site/widget/status/widget.component';
import { CoreUserWidgetComponent } from 'src/app/modules/core-main/user/widget/widget.component';
import { CoreSiteWidgetModuleComponent } from 'src/app/modules/core-main/site/widget/module/widget.component';
import { ChartContentWidgetComponent } from 'src/app/modules/chart/content/widget/widget.component';


@NgModule({
  declarations: [
    DashboardComponent,
    DashboardOneComponent,
    DashboardTwoComponent,
    ApplicationAppWidgetComponent,
    ApplicationMemberInfoWidgetComponent,
    NewsContentWidgetComponent,
    ChartContentWidgetComponent,
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
    ChartContentService,
    ArticleContentService,
    CoreSiteService,
    CoreUserService,
  ]
})
export class DashboardModule { }
