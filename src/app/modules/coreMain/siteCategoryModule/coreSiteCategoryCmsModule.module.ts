import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  CoreModuleService,
  CoreSiteCategoryCmsModuleService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreSiteCategoryCmsModuleTreeComponent } from './tree/tree.component';
import { CoreSiteCategoryCmsModuleSelectorComponent } from './selector/selector.component';
import { CoreSiteCategoryCmsModuleDeleteComponent } from './delete/delete.component';
import { CoreSiteCategoryCmsModuleListComponent } from './list/list.component';
import { TreeviewModule } from 'ngx-treeview';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import { CoreSiteCategoryCmsModuleComponent } from './coreSiteCategoryCmsModule.component';
import { CoreSiteCategoryCmsModuleRouting } from './coreSiteCategoryModule.routing';
import { CoreSiteCategoryCmsModuleListViewComponent } from './listview/listview.component';


@NgModule({
  declarations: [
    CoreSiteCategoryCmsModuleComponent,
    CoreSiteCategoryCmsModuleListComponent,
    CoreSiteCategoryCmsModuleListViewComponent,

    CoreSiteCategoryCmsModuleDeleteComponent,
    CoreSiteCategoryCmsModuleSelectorComponent,
    CoreSiteCategoryCmsModuleTreeComponent,
  ],
  exports: [
    CoreSiteCategoryCmsModuleComponent,
    CoreSiteCategoryCmsModuleListComponent,
    CoreSiteCategoryCmsModuleListViewComponent,

    CoreSiteCategoryCmsModuleDeleteComponent,
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
    CoreSiteCategoryCmsModuleService,
    CoreModuleService,
  ]
})
export class CoreSiteCategoryCmsModuleModule {
}
