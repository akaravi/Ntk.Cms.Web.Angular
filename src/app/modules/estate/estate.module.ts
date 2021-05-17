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
  EstateContractService,
  EstatePropertyDetailService
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
import { EstateAccountAgencyAddComponent } from './account-agency/add/add.component';
import { EstateAccountAgencyEditComponent } from './account-agency/edit/edit.component';
import { EstateAccountAgencyListComponent } from './account-agency/list/list.component';
import { EstateAccountAgencySelectorComponent } from './account-agency/selector/selector.component';
import { EstateAccountAgencyTreeComponent } from './account-agency/tree/tree.component';
import { EstateAccountAgencyTypeUserAddComponent } from './account-agency-typeuser/add/add.component';
import { EstateAccountAgencyTypeUserEditComponent } from './account-agency-typeuser/edit/edit.component';
import { EstateAccountAgencyTypeUserListComponent } from './account-agency-typeuser/list/list.component';
import { EstateAccountAgencyTypeUserSelectorComponent } from './account-agency-typeuser/selector/selector.component';
import { EstatePropertySelectorComponent } from './Property/selector/selector.component';
import { EstateAccountUserAddComponent } from './account-user/add/add.component';
import { EstateAccountUserEditComponent } from './account-user/edit/edit.component';
import { EstateAccountUserListComponent } from './account-user/list/list.component';
import { EstateAccountUserSelectorComponent } from './account-user/selector/selector.component';
import { EstateAccountUserTreeComponent } from './account-user/tree/tree.component';
import { EstatePropertyHistoryAddComponent } from './property-history/add/add.component';
import { EstatePropertyHistoryEditComponent } from './property-history/edit/edit.component';
import { EstatePropertyHistoryListComponent } from './property-history/list/list.component';
import { EstatePropertyDetailAddComponent } from './property-detail/add/add.component';
import { EstatePropertyDetailEditComponent } from './property-detail/edit/edit.component';
import { EstatePropertyDetailListComponent } from './property-detail/list/list.component';
import { EstatePropertyDetailSelectorComponent } from './property-detail/selector/selector.component';
import { EstatePropertyDetailTreeComponent } from './property-detail/tree/tree.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ColorPickerModule } from 'ngx-color-picker';
import { BrowserModule } from '@angular/platform-browser';

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
    EstatePropertySelectorComponent,
    /* */
    EstatePropertyHistoryAddComponent,
    EstatePropertyHistoryEditComponent,
    EstatePropertyHistoryListComponent,
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
    /* */
    EstatePropertyDetailAddComponent,
    EstatePropertyDetailEditComponent,
    EstatePropertyDetailListComponent,
    EstatePropertyDetailSelectorComponent,
    EstatePropertyDetailTreeComponent,
    /* */
    EstateAccountUserAddComponent,
    EstateAccountUserEditComponent,
    EstateAccountUserListComponent,
    EstateAccountUserSelectorComponent,
    EstateAccountUserTreeComponent,
    /* */
    EstateAccountAgencyAddComponent,
    EstateAccountAgencyEditComponent,
    EstateAccountAgencyListComponent,
    EstateAccountAgencySelectorComponent,
    EstateAccountAgencyTreeComponent,
    /* */
    EstateAccountAgencyTypeUserAddComponent,
    EstateAccountAgencyTypeUserEditComponent,
    EstateAccountAgencyTypeUserListComponent,
    EstateAccountAgencyTypeUserSelectorComponent,
    /* */
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
    DragDropModule,
    ColorPickerModule,

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
    EstatePropertyDetailService,
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
