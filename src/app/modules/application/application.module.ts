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
  ApplicationEnumService,
  CoreModuleTagService
} from 'ntk-cms-api';
import { ApplicationSourceTreeComponent } from './source/tree/tree.component';
import { ApplicationAppTreeComponent } from './content/tree/tree.component';
import { ApplicationSourceAddComponent } from './source/add/add.component';
import { ApplicationSourceEditComponent } from './source/edit/edit.component';
import { ApplicationSourceDeleteComponent } from './source/delete/delete.component';
import {MatIconModule} from '@angular/material/icon';
import { TranslationModule } from '../i18n/translation.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import { ApplicationSourceSelectorComponent } from './source/selector/selector.component';
import { ApplicationThemeConfigSelectorComponent } from './themeConfig/selector/selector.component';
import { ApplicationAppEditComponent } from './content/edit/edit.component';
import { ApplicationAppAddComponent } from './content/add/add.component';
import { ApplicationIntroAddComponent } from './intro/add/add.component';
import { ApplicationIntroEditComponent } from './intro/edit/edit.component';
import { ApplicationAppSelectorComponent } from './content/selector/selector.component';

@NgModule({
  declarations: [
    ApplicationComponent,
    ApplicationSourceListComponent,
    ApplicationSourceTreeComponent,
    ApplicationSourceAddComponent,
    ApplicationSourceEditComponent,
    ApplicationSourceDeleteComponent,
    ApplicationSourceSelectorComponent,
    ApplicationAppListComponent,
    ApplicationAppAddComponent,
    ApplicationAppEditComponent,
    ApplicationAppSelectorComponent,
    ApplicationMemberInfoListComponent,
    ApplicationIntroListComponent,
    ApplicationIntroAddComponent,
    ApplicationIntroEditComponent,
    ApplicationNotificationListComponent,
    ApplicationThemeConfigListComponent,
    ApplicationThemeConfigSelectorComponent,
    ApplicationAppTreeComponent,
  ],
  imports: [
    CommonModule,
    TranslationModule,
    ApplicationRoutes,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    TreeviewModule.forRoot(),
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
    ProgressSpinnerModule,
    CmsFileManagerModule,
    MatIconModule,
    MatFormFieldModule,
    MatStepperModule
  ],
  providers: [
    CoreEnumService,
    CoreAuthService,
    ApplicationEnumService,
    CoreModuleTagService,
    ApplicationAppService,
    ApplicationIntroService,
    ApplicationSourceService,
    ApplicationMemberInfoService,
    ApplicationLogNotificationService,
    ApplicationThemeConfigService,
  ]
})
export class ApplicationModule { }
