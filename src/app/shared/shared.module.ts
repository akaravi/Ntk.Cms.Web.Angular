import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';

import { NgxQueryBuilderModule } from 'ngx-query-builder';

import { TreeModule } from '@circlon/angular-tree-component';
import { TruncatePipe } from '../core/pipe/truncate.pipe';
import { PersianDate } from '../core/pipe/PersianDatePipe/persian-date.pipe';
import { CmsSearchListComponent } from './cmsSearchList/cmsSearchList.component';
import { CmsStatistListComponent } from './cmsStatistList/cmsStatistList.component';
import { CmsExportListComponent } from './cmsExportList/cmsExportList.component';
import { CmsMapComponent } from './cmsMap/cmsMap.Component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { TagAutocompleteComponent } from '../modules/core-module/tag/autocomplete/autocomplete.component';
import { TagInputModule } from 'ngx-chips';
import { RecordStatusClassPipe } from '../core/pipe/recordStatusClass.pipe';
import { BoolStatusClassPipe } from '../core/pipe/boolStatusClass.pipe';
import { PersianDateFull } from '../core/pipe/PersianDatePipe/persian-date-full.pipe';
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component';
import { OverlayService } from './overlay/overlay.service';
import { TranslationModule } from '../core/i18n/translation.module';
import { HttpConfigInterceptor } from '../core/interceptor/httpConfigInterceptor';
import { KeysPipe } from '../core/pipe/keys.pipe';
import { EnumsPipe } from '../core/pipe/enums.pipe';
import { PrettyjsonPipe } from '../core/pipe/prettyjson.pipe';
import { CmsSiteSelectorComponent } from './cmsSiteSelector/cmsSiteSelector.component';
import { CmsUserSelectorComponent } from './cmsUserSelector/cmsUserSelector.component';
import { CmsMemberSelectorComponent } from './cmsMemberSelector/cmsMemberSelector.component';
import { CoreGuideService, CoreSiteService, CoreUserService, MemberUserService } from 'ntk-cms-api';
import { PasswordStrengthComponent } from './password-strength/password-strength.component';import { CmsJsonListComponent } from './cmsJsonList/cmsJsonList.component';;
import { CmsGuideComponent } from './cms-guide/cms-guide.component'
;
import { CmsGuideDirective } from '../core/directive/cms-guide.directive';




@NgModule({
  imports: [
    CommonModule,
    TranslationModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    HttpClientModule,
    MaterialModule,
    TreeModule,
    NgxQueryBuilderModule,
    LeafletModule,
    TagInputModule,
  ],
  entryComponents: [
    // All components about to be loaded "dynamically" need to be declared in the entryComponents section.
  ],
  declarations: [
    // common and shared components/directives/pipes between more than one module and components will be listed here.
    TruncatePipe,
    KeysPipe,
    EnumsPipe,
    PrettyjsonPipe,
    RecordStatusClassPipe,
    BoolStatusClassPipe,
    CmsSearchListComponent,
    CmsStatistListComponent,
    CmsExportListComponent,
    CmsSiteSelectorComponent,
    CmsUserSelectorComponent,
    CmsMemberSelectorComponent,
    PersianDate,
    PersianDateFull,
    CmsMapComponent,
    TagAutocompleteComponent,
    ProgressSpinnerComponent,
    PasswordStrengthComponent,
    CmsJsonListComponent,
    CmsGuideComponent,
    /**Directive */
    CmsGuideDirective,
  ],
  exports: [
    // common and shared components/directives/pipes between more than one module and components will be listed here.
    CommonModule,
    TranslationModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    TreeModule,
    TruncatePipe,
    KeysPipe,
    EnumsPipe,
    PrettyjsonPipe,
    RecordStatusClassPipe,
    BoolStatusClassPipe,
    PersianDate,
    PersianDateFull,
    CmsSearchListComponent,
    CmsStatistListComponent,
    CmsExportListComponent,
    CmsSiteSelectorComponent,
    CmsUserSelectorComponent,
    CmsMemberSelectorComponent,
    CmsMapComponent,
    TagAutocompleteComponent,
    ProgressSpinnerComponent,
    PasswordStrengthComponent,
    CmsJsonListComponent,
    CmsGuideComponent,
    /**Directive */
    CmsGuideDirective,

  ],
  providers: [
    OverlayService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
    MemberUserService,
    CoreUserService,
    CoreSiteService,
    CoreGuideService
  ]
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
