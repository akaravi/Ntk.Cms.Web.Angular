import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmsLogComponent } from './smsLog.component';
import { SmsLogRoutes } from './smsLog.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeviewModule } from 'ngx-treeview';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
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
import {MatIconModule} from '@angular/material/icon';
import { TranslationModule } from '../../../core/i18n/translation.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';

import { CmsFileUploaderModule } from 'ntk-cms-fileuploader';
import { CmsConfirmationDialogService } from 'src/app/shared/cmsConfirmationDialog/cmsConfirmationDialog.service';

@NgModule({
  declarations: [
    SmsLogComponent,
  ],
  imports: [
    CommonModule,
    TranslationModule,
    SmsLogRoutes,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    TreeviewModule.forRoot(),
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
    CmsFileManagerModule,
    MatIconModule,
    MatFormFieldModule,
    MatStepperModule,
    CmsFileUploaderModule
  ],
  providers: [
    CoreEnumService,
    CoreAuthService,
    CmsConfirmationDialogService ,
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
export class SmsLogModule { }