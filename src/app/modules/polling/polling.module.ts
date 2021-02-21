import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PollingRouting } from './polling.routing';
import { PollingComponent } from './polling.component';
import { TagInputModule } from 'ngx-chips';

import {
  CoreEnumService,
  CoreModuleTagService,
  PollingCategoryService,
  PollingContentService,
  PollingOptionService,
  PollingVoteService,

} from 'ntk-cms-api';
import { PollingCategoryEditComponent } from './category/edit/edit.component';
import { PollingCategoryDeleteComponent } from './category/delete/delete.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeviewModule } from 'ngx-treeview';
import { SharedModule } from 'src/app/shared/shared.module';

import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import { PollingCategorySelectorComponent } from './category/selector/selector.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { PollingContentListComponent } from './content/list/list.component';
import { PollingContentAddComponent } from './content/add/add.component';
import { PollingContentEditComponent } from './content/edit/edit.component';
import { PollingCategoryTreeComponent } from './category/tree/tree.component';
import { PollingContentDeleteComponent } from './content/delete/delete.component';
import { PollingVoteEditComponent } from './vote/edit/edit.component';
import { PollingVoteListComponent } from './vote/list/list.component';
import { PollingVoteDeleteComponent } from './vote/delete/delete.component';


@NgModule({
  declarations: [
    PollingComponent,
    PollingCategorySelectorComponent,
    PollingCategoryEditComponent,
    PollingCategoryDeleteComponent,
    PollingCategoryTreeComponent,
    PollingContentListComponent,
    PollingContentAddComponent,
    PollingContentEditComponent,
    PollingContentDeleteComponent,
    PollingVoteEditComponent,
    PollingVoteListComponent,
    PollingVoteDeleteComponent
  ],
  imports: [
    CommonModule,
    PollingRouting,
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
    PollingCategoryService,
    PollingContentService,
    PollingOptionService,
    PollingVoteService,
  ]
})
export class PollingModule { }
