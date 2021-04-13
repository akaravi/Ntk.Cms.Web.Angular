import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreLogComponent } from './coreLog.component';
import { CoreLogRoutes } from './coreLog.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeviewModule } from 'ngx-treeview';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import { TagInputModule } from 'ngx-chips';
import {
  CoreLogErrorService,
  CoreLogSmsService,
} from 'ntk-cms-api';
import { CoreLogSmsListComponent } from './sms/list/list.component';
import { CoreLogErrorEditComponent } from './error/edit/edit.component';
import { CoreLogErrorListComponent } from './error/list/list.component';
import { CoreLogSmsEditComponent } from './sms/edit/edit.component';



@NgModule({
  imports: [
    CoreLogRoutes,
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    TreeviewModule.forRoot(),
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
    CmsFileManagerModule
  ],
  declarations: [
    CoreLogComponent,
    CoreLogSmsListComponent,
    CoreLogSmsEditComponent,
    CoreLogErrorListComponent,
    CoreLogErrorEditComponent,
  ],
  exports: [
    CoreLogComponent,
    CoreLogSmsListComponent,
    CoreLogSmsEditComponent,
    CoreLogErrorListComponent,
    CoreLogErrorEditComponent,

  ],
  providers: [
    CoreLogErrorService,
    CoreLogSmsService,
  ]
})
export class CoreLogModule { }
