import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import {TranslationService} from '../../modules/i18n/translation.service';
import {TranslateService} from '@ngx-translate/core';
import {SiteModule} from '../core/site/site.module';
import {DashboardsModule} from '../../_metronic/partials/content/dashboards/dashboards.module';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
      },
    ]),
    DashboardsModule,
    SiteModule
  ]
})
export class DashboardModule { }
