import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmsConfigComponent } from './smsConfig.component';
import { SmsConfigRoutes } from './smsConfig.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeviewModule } from 'ngx-treeview';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import {
  CoreAuthService,
  CoreEnumService,
  CoreModuleTagService
} from 'ntk-cms-api';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatStepperModule} from '@angular/material/stepper';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';

@NgModule({
  declarations: [
    SmsConfigComponent,
  ],
  imports: [
    CommonModule,
    SmsConfigRoutes,
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
  ],
  providers: [
    CoreEnumService,
    CoreAuthService,
    CmsConfirmationDialogService ,
    CoreModuleTagService,

  ]
})
export class SmsConfigModule { }
