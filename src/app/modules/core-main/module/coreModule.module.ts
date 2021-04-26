import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModuleRouting } from './coreModule.routing';
import { CoreModuleComponent } from './coreModule.component';
import {
  CoreModuleService,
} from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModuleTreeComponent } from './tree/tree.component';
import { CoreModuleSelectorComponent } from './selector/selector.component';
import { CoreModuleEditComponent } from './edit/edit.component';
import { CoreModuleAddComponent } from './add/add.component';
import { CoreModuleListComponent } from './list/list.component';
import { TreeviewModule } from 'ngx-treeview';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import { CoreModuleRenewComponent } from './renew/renew.component';


@NgModule({
  declarations: [
    CoreModuleComponent,
    CoreModuleListComponent,
    CoreModuleAddComponent,
    CoreModuleEditComponent,
    CoreModuleSelectorComponent,
    CoreModuleTreeComponent,
    CoreModuleRenewComponent,
  ],
  exports: [
    CoreModuleComponent,
    CoreModuleListComponent,
    CoreModuleAddComponent,
    CoreModuleEditComponent,
    CoreModuleSelectorComponent,
    CoreModuleTreeComponent,
    CoreModuleRenewComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    CoreModuleRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    TreeviewModule.forRoot(),
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
  ],
  providers: [
    CoreModuleService,
  ]
})
export class CoreModuleModule {
}
