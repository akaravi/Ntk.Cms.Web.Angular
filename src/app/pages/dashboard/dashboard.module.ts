import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import {TranslationService} from '../../core/i18n/translation.service';
import {TranslateService} from '@ngx-translate/core';
import {CoreSiteModule} from '../../modules/core/site/coreSite.module';
import {DashboardsModule} from '../../core/partials/content/dashboards/dashboards.module';
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
    CoreSiteModule
  ]
})
export class DashboardModule { }
