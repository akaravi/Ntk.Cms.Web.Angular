import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';

import { NgxQueryBuilderModule } from 'ngx-query-builder';

import { TreeModule } from '@circlon/angular-tree-component';
import { TruncatePipe } from '../core/pipe/truncate.pipe';
import { PersianDate } from '../core/pipe/PersianDatePipe/persian-date.pipe';
import { CmsSearchListComponent } from './cmsSearchList/cmsSearchList.component';
import { CmsStatistListComponent } from './cmsStatistList/cmsStatistList.component';
import { CmsExportListComponent } from './cmsExportList/cmsExportList.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    TreeModule,
    NgxQueryBuilderModule,

  ],
  entryComponents: [
    // All components about to be loaded "dynamically" need to be declared in the entryComponents section.
  ],
  declarations: [
    // common and shared components/directives/pipes between more than one module and components will be listed here.
    TruncatePipe,
    CmsSearchListComponent,
    CmsStatistListComponent,
    CmsExportListComponent,
    PersianDate,

  ],
  exports: [
    // common and shared components/directives/pipes between more than one module and components will be listed here.
    CommonModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    TreeModule,
    TruncatePipe,
    PersianDate,
    CmsSearchListComponent,
    CmsStatistListComponent,
    CmsExportListComponent
  ],
  /* No providers here! Since they’ll be already provided in AppModule. */
})
export class SharedModule {
  static forRoot(): any {
    // Forcing the whole app to use the returned providers from the AppModule only.
    return {
      ngModule: SharedModule,
      providers: [
        /* All of your services here. It will hold the services needed by `itself`. */
      ],
    };
  }
}
