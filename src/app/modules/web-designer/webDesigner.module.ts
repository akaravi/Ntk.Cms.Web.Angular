import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebDesignerComponent } from './webDesigner.component';
import { WebDesignerRoutes } from './webDesigner.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeviewModule } from 'ngx-treeview';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import {
  CoreAuthService,
  CoreEnumService,
  CoreModuleTagService,
  WebDesignerConfigurationService,
  WebDesignerLogPageSafeService,
  WebDesignerMainIntroService,
  WebDesignerMainMenuService,
  WebDesignerMainPageDependencyService,
  WebDesignerMainPageService,
  WebDesignerMainPageTemplateService
} from 'ntk-cms-api';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';

import { CmsFileUploaderModule } from 'ntk-cms-fileuploader';
import { CmsConfirmationDialogService } from 'src/app/shared/cmsConfirmationDialog/cmsConfirmationDialog.service';
import { WebDesignerConfigMainAdminComponent } from './config/mainAdmin/configMainAdmin.component';
import { WebDesignerConfigSiteComponent } from './config/site/configSite.component';
import { WebDesignerMainIntroListComponent } from './intro/list/list.component';
import { WebDesignerMainIntroAddComponent } from './intro/add/add.component';
import { WebDesignerMainIntroEditComponent } from './intro/edit/edit.component';
import { WebDesignerMainMenuEditComponent } from './menu/edit/edit.component';
import { WebDesignerMainMenuListComponent } from './menu/list/list.component';
import { WebDesignerMainMenuSelectorComponent } from './menu/selector/selector.component';
import { WebDesignerMainMenuTreeComponent } from './menu/tree/tree.component';
import { WebDesignerMainMenuAddComponent } from './menu/add/add.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { IconPickerModule } from 'ngx-icon-picker';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { WebDesignerMainPageDependencyAddComponent } from './page-dependency/add/add.component';
import { WebDesignerMainPageDependencyEditComponent } from './page-dependency/edit/edit.component';
import { WebDesignerMainPageDependencyListComponent } from './page-dependency/list/list.component';
import { WebDesignerMainPageDependencySelectorComponent } from './page-dependency/selector/selector.component';
import { WebDesignerMainPageDependencyTreeComponent } from './page-dependency/tree/tree.component';
import { WebDesignerMainPageDependencyHeaderComponent } from './page-dependency/header/header.component';

@NgModule({
  declarations: [
    WebDesignerComponent,
    /*Config*/
    WebDesignerConfigMainAdminComponent,
    WebDesignerConfigSiteComponent,
    /*Config*/
    /** */
    WebDesignerMainIntroAddComponent,
    WebDesignerMainIntroEditComponent,
    WebDesignerMainIntroListComponent,
    /** */
    /** */
    WebDesignerMainMenuAddComponent,
    WebDesignerMainMenuEditComponent,
    WebDesignerMainMenuListComponent,
    WebDesignerMainMenuSelectorComponent,
    WebDesignerMainMenuTreeComponent,
    /** */
    /** */
    WebDesignerMainPageDependencyAddComponent,
    WebDesignerMainPageDependencyEditComponent,
    WebDesignerMainPageDependencyListComponent,
    WebDesignerMainPageDependencySelectorComponent,
    WebDesignerMainPageDependencyTreeComponent,
    WebDesignerMainPageDependencyHeaderComponent,
    /** */
  ],
  imports: [
    CommonModule,
    WebDesignerRoutes,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    TreeviewModule.forRoot(),
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
    CmsFileManagerModule,
    MatIconModule,
    MatFormFieldModule,
    MatStepperModule,
    CmsFileUploaderModule,
    ColorPickerModule,
    IconPickerModule,
    DragDropModule
  ],
  providers: [
    CoreEnumService,
    CoreAuthService,
    /*Config*/
    WebDesignerConfigurationService,
    /*Config*/
    CmsConfirmationDialogService,
    CoreModuleTagService,
    WebDesignerLogPageSafeService,
    WebDesignerMainIntroService,
    WebDesignerMainMenuService,
    WebDesignerMainPageService,
    WebDesignerMainPageDependencyService,
    WebDesignerMainPageTemplateService
  ]
})
export class WebDesignerModule { }
