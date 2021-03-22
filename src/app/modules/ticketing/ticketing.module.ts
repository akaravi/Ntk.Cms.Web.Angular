import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketingRouting } from './ticketing.routing';
import { TicketingComponent } from './ticketing.component';
import { TagInputModule } from 'ngx-chips';

import {
  CoreEnumService,
  CoreModuleTagService,
  TicketingDepartemenLogService,
  TicketingDepartemenOperatorService,
  TicketingDepartemenService,
  TicketingFaqService,
  TicketingTaskService,
  TicketingTemplateService,
} from 'ntk-cms-api';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeviewModule } from 'ngx-treeview';
import { SharedModule } from 'src/app/shared/shared.module';

import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TicketingDepartemenListComponent } from './departemen/list/list.component';
import { TicketingDepartemenSelectorComponent } from './departemen/selector/selector.component';
import { TicketingDepartemenTreeComponent } from './departemen/tree/tree.component';
import { TicketingDepartemenDeleteComponent } from './departemen/delete/delete.component';
import { TicketingDepartemenEditComponent } from './departemen/edit/edit.component';
import { TicketingFaqEditComponent } from './faq/edit/edit.component';
import { TicketingFaqListComponent } from './faq/list/list.component';
import { CmsConfirmationDialogService } from 'src/app/shared/cmsConfirmationDialog/cmsConfirmationDialog.service';
import { TicketingTaskListComponent } from './task/list/list.component';
import { TicketingTaskEditComponent } from './task/edit/edit.component';
import { TicketingDepartemenAddComponent } from './departemen/add/add.component';
import { TicketingTemplateListComponent } from './template/list/list.component';
import { TicketingFaqAddComponent } from './faq/add/add.component';
import { TicketingTemplateAddComponent } from './template/add/add.component';
import { TicketingTemplateEditComponent } from './template/edit/edit.component';
import { TicketingDepartemenLogEditComponent } from './departemenLog/edit/edit.component';
import { TicketingDepartemenOperatorAddComponent } from './departemenOperator/add/add.component';
import { TicketingDepartemenOperatorEditComponent } from './departemenOperator/edit/edit.component';
import { TicketingTaskAddComponent } from './task/add/add.component';
import { TicketingDepartemenLogListComponent } from './departemenLog/list/list.component';



@NgModule({
  declarations: [
    TicketingComponent,
    TicketingDepartemenListComponent,
    TicketingDepartemenAddComponent,
    TicketingDepartemenEditComponent,
    TicketingDepartemenDeleteComponent,
    TicketingDepartemenSelectorComponent,
    TicketingDepartemenTreeComponent,
    TicketingFaqAddComponent,
    TicketingFaqEditComponent,
    TicketingFaqListComponent,
    TicketingTemplateAddComponent,
    TicketingTemplateEditComponent,
    TicketingTemplateListComponent,
    TicketingTaskListComponent,
    TicketingTaskEditComponent,
    TicketingTaskAddComponent,
    TicketingDepartemenLogEditComponent,
    TicketingDepartemenOperatorAddComponent,
    TicketingDepartemenOperatorEditComponent,
    TicketingDepartemenLogListComponent
  ],
  imports: [
    CommonModule,
    TicketingRouting,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    TreeviewModule.forRoot(),
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
    CmsFileManagerModule
  ],
  providers: [
    CoreEnumService,
    CoreModuleTagService,
    TicketingDepartemenService,
    TicketingDepartemenLogService,
    TicketingDepartemenOperatorService,
    TicketingTaskService,
    TicketingFaqService,
    TicketingTemplateService,
    CmsConfirmationDialogService
  ]
})
export class TicketingModule { }
