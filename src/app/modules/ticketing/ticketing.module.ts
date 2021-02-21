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



@NgModule({
  declarations: [
    TicketingComponent,
    TicketingDepartemenListComponent,
    
    TicketingDepartemenEditComponent,
    TicketingDepartemenDeleteComponent,
    TicketingDepartemenSelectorComponent,
    TicketingDepartemenTreeComponent,
    
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
    //ProgressSpinnerModule,
    CmsFileManagerModule
  ],
  providers: [
    CoreEnumService,
    CoreModuleTagService,
    TicketingDepartemenService,
    TicketingDepartemenLogService,
    TicketingDepartemenOperatorService,
    TicketingTaskService,
    TicketingFaqService
  ]
})
export class TicketingModule { }
