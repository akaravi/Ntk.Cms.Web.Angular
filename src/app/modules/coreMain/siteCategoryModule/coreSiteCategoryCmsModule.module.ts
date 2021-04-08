import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  CoreModuleService,
  CoreSiteCategoryModuleService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreSiteCategoryCmsModuleTreeComponent } from './tree/tree.component';
import { CoreSiteCategoryCmsModuleSelectorComponent } from './selector/selector.component';
import { CoreSiteCategoryCmsModuleListComponent } from './list/list.component';
import { TreeviewModule } from 'ngx-treeview';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import { CoreSiteCategoryCmsModuleComponent } from './coreSiteCategoryCmsModule.component';
import { CoreSiteCategoryCmsModuleRouting } from './coreSiteCategoryCmsModule.routing';
import { CoreSiteCategoryCmsModuleListViewComponent } from './listview/listview.component';
import { CmsConfirmationDialogService } from 'src/app/shared/cmsConfirmationDialog/cmsConfirmationDialog.service';


@NgModule({
  declarations: [
    CoreSiteCategoryCmsModuleComponent,
    CoreSiteCategoryCmsModuleListComponent,
    CoreSiteCategoryCmsModuleListViewComponent,

    CoreSiteCategoryCmsModuleSelectorComponent,
    CoreSiteCategoryCmsModuleTreeComponent,
  ],
  exports: [
    CoreSiteCategoryCmsModuleComponent,
    CoreSiteCategoryCmsModuleListComponent,
    CoreSiteCategoryCmsModuleListViewComponent,

    CoreSiteCategoryCmsModuleSelectorComponent,
    CoreSiteCategoryCmsModuleTreeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    CoreSiteCategoryCmsModuleRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    TreeviewModule.forRoot(),
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
  ],
  providers: [
    CoreSiteCategoryModuleService,
    CmsConfirmationDialogService,
    CoreModuleService,
  ]
})
export class CoreSiteCategoryCmsModuleModule {
}
