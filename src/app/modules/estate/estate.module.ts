import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstateComponent } from './estate.component';
import { EstateRoutes } from './estate.routing';

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
  EstateConfigurationService,
  EstatePropertyTypeService,
  EstatePropertyService
} from 'ntk-cms-api';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { EstateConfigMainAdminComponent } from './config/mainAdmin/configMainAdmin.component';
import { EstateConfigSiteComponent } from './config/site/configSite.component';
import { EstatePropertyTypeAddComponent } from './property-type/add/add.component';
import { EstatePropertyTypeEditComponent } from './property-type/edit/edit.component';
import { EstatePropertyTypeListComponent } from './property-type/list/list.component';
import { EstatePropertyTypeSelectorComponent } from './property-type/selector/selector.component';
import { EstatePropertyTypeTreeComponent } from './property-type/tree/tree.component';
import { EstatePropertyAddComponent } from './Property/add/add.component';
import { EstatePropertyEditComponent } from './Property/edit/edit.component';
import { EstatePropertyListComponent } from './Property/list/list.component';

@NgModule({
  declarations: [
    EstateComponent,
    /*Config*/
    EstateConfigMainAdminComponent,
    EstateConfigSiteComponent,
    /*Config*/
    /* */
    EstatePropertyTypeAddComponent,
    EstatePropertyTypeEditComponent,
    EstatePropertyTypeListComponent,
    EstatePropertyTypeSelectorComponent,
    EstatePropertyTypeTreeComponent,
    /* */
    EstatePropertyAddComponent,
    EstatePropertyEditComponent,
    EstatePropertyListComponent,
  ],
  imports: [
    CommonModule,
    EstateRoutes,
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
  ],
  providers: [
    CoreEnumService,
    CoreAuthService,
    /*Config*/
    EstateConfigurationService,
    /*Config*/
    EstatePropertyTypeService,
    EstatePropertyService,
    CmsConfirmationDialogService,
    CoreModuleTagService,

  ]
})
export class EstateModule { }
