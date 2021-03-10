import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreComponent } from './core.component';
import { CoreRoutes } from './core.routing';
import { CoreSiteModule } from './site/coreSite.module';
import { CoreSiteCategoryCmsModule } from './siteCategory/coreSiteCategory.module';

@NgModule({
  imports: [
    CoreRoutes,
    CommonModule,

  ],
  declarations: [CoreComponent]
})
export class CoreModule { }
