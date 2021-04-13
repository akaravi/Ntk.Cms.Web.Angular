import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreUserGroupRouting } from './coreUserGroup.routing';
import { CoreUserGroupComponent } from './coreUserGroup.component';
import {
  CoreModuleService,
  CoreUserGroupService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreUserGroupTreeComponent } from './tree/tree.component';
import { CoreUserGroupSelectorComponent } from './selector/selector.component';
import { CoreUserGroupEditComponent } from './edit/edit.component';
import { CoreUserGroupAddComponent } from './add/add.component';
import { CoreUserGroupListComponent } from './list/list.component';
import { TreeviewModule } from 'ngx-treeview';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import { CoreUserGroupChecklistComponent } from './checklist/checklist.component';


@NgModule({
  declarations: [
    CoreUserGroupComponent,
    CoreUserGroupListComponent,
    CoreUserGroupAddComponent,
    CoreUserGroupEditComponent,
    CoreUserGroupSelectorComponent,
    CoreUserGroupTreeComponent,
    CoreUserGroupChecklistComponent,
  ],
  exports: [
    CoreUserGroupComponent,
    CoreUserGroupListComponent,
    CoreUserGroupAddComponent,
    CoreUserGroupEditComponent,
    CoreUserGroupSelectorComponent,
    CoreUserGroupTreeComponent,
    CoreUserGroupChecklistComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    CoreUserGroupRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    TreeviewModule.forRoot(),
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
    // CmsFileManagerModule

  ],
  providers: [
    CoreUserGroupService,
    CoreModuleService,
  ]
})
export class CoreUserGroupCmsModule {
}