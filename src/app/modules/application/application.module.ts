import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationComponent } from './application.component';
import { ApplicationRoutes } from './application.routing';
import { ApplicationAppListComponent } from './content/list/list.component';
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
import {
  ApplicationAppService,
  ApplicationIntroService,
  ApplicationLogNotificationService,
  ApplicationMemberInfoService,
  ApplicationSourceService,
  ApplicationThemeConfigService,
  CoreAuthService,
  CoreEnumService,
  CoreModuleTagService
} from 'ntk-cms-api';
import { ApplicationSourceTreeComponent } from './source/tree/tree.component';
import { ApplicationAppTreeComponent } from './content/tree/tree.component';
import { ApplicationSourceAddComponent } from './source/add/add.component';
import { ApplicationSourceEditComponent } from './source/edit/edit.component';
import { ApplicationSourceDeleteComponent } from './source/delete/delete.component';

@NgModule({
  declarations: [
    ApplicationComponent,
    ApplicationSourceListComponent,
    ApplicationSourceTreeComponent,
    ApplicationSourceAddComponent,
    ApplicationSourceEditComponent,
    ApplicationSourceDeleteComponent,
    ApplicationAppListComponent,
    ApplicationMemberInfoListComponent,
    ApplicationIntroListComponent,
    ApplicationNotificationListComponent,
    ApplicationThemeConfigListComponent,
    ApplicationAppTreeComponent,
  ],
  imports: [
    CommonModule,
    ApplicationRoutes,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    TreeviewModule.forRoot(),
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
    ProgressSpinnerModule,
    CmsFileManagerModule
  ],
  providers: [
    CoreEnumService,
    CoreAuthService,
    CoreModuleTagService,
    ApplicationAppService,
    ApplicationIntroService,
    ApplicationSourceService,
    ApplicationMemberInfoService,
    ApplicationLogNotificationService,
    ApplicationThemeConfigService


  ]
})
export class ApplicationModule { }
