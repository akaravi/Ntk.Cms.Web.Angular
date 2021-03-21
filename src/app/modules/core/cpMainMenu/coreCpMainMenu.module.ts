import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreCpMainMenuRouting } from './coreCpMainMenu.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeviewModule } from 'ngx-treeview';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import { CoreEnumService, CoreSiteUserService,  CoreCpMainMenuService } from 'ntk-cms-api';
import { CmsConfirmationDialogService } from 'src/app/shared/cmsConfirmationDialog/cmsConfirmationDialog.service';
import { CoreCpMainMenuComponent } from './coreCpMainMenu.component';
import { CoreCpMainMenuListComponent } from './list/list.component';
import { CoreCpMainMenuAddComponent } from './add/add.component';
import { CoreCpMainMenuEditComponent } from './edit/edit.component';
import { CoreCpMainMenuSelectorComponent } from './selector/selector.component';
import { CoreCpMainMenuTreeComponent } from './tree/tree.component';
import { CoreModuleModule } from '../module/coreModule.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { IconPickerModule } from 'ngx-icon-picker';



@NgModule({
  declarations: [
    CoreCpMainMenuComponent,
    CoreCpMainMenuListComponent,
    CoreCpMainMenuAddComponent,
    CoreCpMainMenuEditComponent,
    CoreCpMainMenuTreeComponent,
    CoreCpMainMenuSelectorComponent,
  ],
  exports: [
    CoreCpMainMenuComponent,
    CoreCpMainMenuListComponent,
    CoreCpMainMenuAddComponent,
    CoreCpMainMenuEditComponent,
    CoreCpMainMenuTreeComponent,
    CoreCpMainMenuSelectorComponent,
  ],
  imports: [
    CommonModule,
    CoreCpMainMenuRouting,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    TreeviewModule.forRoot(),
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
    CoreModuleModule,
    ColorPickerModule,
    IconPickerModule
  ],
  providers: [
    CoreEnumService,
    CoreCpMainMenuService,
    CoreSiteUserService,
    CmsConfirmationDialogService
  ]
})
export class CoreCpMainMenu { }
