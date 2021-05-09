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
  EstatePropertyService,
  EstateContractTypeService,
  EstatePropertyDetailGroupService,
  EstateAccountAgencyService,
  EstateAccountAgencyTypeUserService,
  EstateAccountUserService,
  EstateEnumService,
  EstatePropertyAccountTypeUserService,
  EstatePropertyHistoryService,
  EstatePropertyShareAgencyService,
  EstatePropertyShareAgentService,
  EstatePropertyShareSiteService,
  EstateContractService
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
import { EstateContractTypeAddComponent } from './contract-type/add/add.component';
import { EstateContractTypeEditComponent } from './contract-type/edit/edit.component';
import { EstateContractTypeListComponent } from './contract-type/list/list.component';
import { EstateContractTypeSelectorComponent } from './contract-type/selector/selector.component';
import { EstateContractTypeTreeComponent } from './contract-type/tree/tree.component';
import { EstatePropertyDetailGroupAddComponent } from './property-detail-group/add/add.component';
import { EstatePropertyDetailGroupEditComponent } from './property-detail-group/edit/edit.component';
import { EstatePropertyDetailGroupListComponent } from './property-detail-group/list/list.component';
import { EstatePropertyDetailGroupSelectorComponent } from './property-detail-group/selector/selector.component';
import { EstatePropertyDetailGroupTreeComponent } from './property-detail-group/tree/tree.component';
import { IconPickerModule } from 'ngx-icon-picker';

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
    /* */
    EstateContractTypeAddComponent,
    EstateContractTypeEditComponent,
    EstateContractTypeListComponent,
    EstateContractTypeSelectorComponent,
    EstateContractTypeTreeComponent,
    /* */
    EstatePropertyDetailGroupAddComponent,
    EstatePropertyDetailGroupEditComponent,
    EstatePropertyDetailGroupListComponent,
    EstatePropertyDetailGroupSelectorComponent,
    EstatePropertyDetailGroupTreeComponent,
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
    IconPickerModule,
  ],
  providers: [
    CoreEnumService,
    CoreAuthService,
    /*Config*/
    EstateConfigurationService,
    /*Config*/
    /** */
    EstateAccountAgencyService,
    EstateAccountAgencyTypeUserService,
    EstateAccountUserService,
    EstateContractService,
    EstateContractTypeService,
    EstateEnumService,
    EstatePropertyService,
    EstatePropertyAccountTypeUserService,
    EstatePropertyDetailGroupService,
    EstatePropertyHistoryService,
    EstatePropertyShareAgencyService,
    EstatePropertyShareAgentService,
    EstatePropertyShareSiteService,
    EstatePropertyTypeService,
    /** */
    CmsConfirmationDialogService,
    CoreModuleTagService,



  ]
})
export class EstateModule { }
