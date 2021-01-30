import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationComponent } from './application.component';
import { ApplicationRoutes } from './application.routing';
import { ApplicationAppListComponent } from './app/list/list.component';
import { ApplicationMemberInfoListComponent } from './memberInfo/list/list.component';
import { ApplicationIntroListComponent } from './intro/list/list.component';
import { ApplicationNotificationListComponent } from './notification/list/list.component';
import { ApplicationSourceListComponent } from './source/list/list.component';
import { ApplicationThemeConfigListComponent } from './themeConfig/list/list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeviewModule } from 'ngx-treeview';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import { ProgressSpinnerModule } from 'src/app/shared/progress-spinner/progress-spinner.module';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import { ApplicationAppService, CoreAuthService, CoreEnumService, CoreModuleTagService } from 'ntk-cms-api';

@NgModule({
  imports: [
    ApplicationRoutes,
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    TreeviewModule.forRoot(),
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
    ProgressSpinnerModule,
    CmsFileManagerModule
  ],
  declarations: [
    ApplicationComponent,
    ApplicationAppListComponent,
    ApplicationMemberInfoListComponent,
    ApplicationIntroListComponent,
    ApplicationNotificationListComponent,
    ApplicationSourceListComponent,
    ApplicationThemeConfigListComponent
  ],
  providers: [
    CoreEnumService,
    CoreModuleTagService,
    ApplicationAppService,
    CoreAuthService,

  ]
})
export class ApplicationModule { }
