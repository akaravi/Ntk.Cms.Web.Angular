import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EstatePropertyTypeListComponent } from './property-type/list/list.component';
import { EstateConfigMainAdminComponent } from './config/mainAdmin/configMainAdmin.component';
import { EstateConfigSiteComponent } from './config/site/configSite.component';
import { EstatePropertyListComponent } from './Property/list/list.component';
import { EstateComponent } from './estate.component';
import { EstateContractTypeListComponent } from './contract-type/list/list.component';
import { EstatePropertyDetailGroupListComponent } from './property-detail-group/list/list.component';
import { EstatePropertyDetailListComponent } from './property-detail/list/list.component';
import { EstateAccountAgencyListComponent } from './account-agency/list/list.component';
import { EstateAccountUserListComponent } from './account-user/list/list.component';

const routes: Routes = [
  {
    path: '',
    component: EstateComponent,
    children: [
      /*Config*/
      {
        path: 'config/mainadmin',
        component: EstateConfigMainAdminComponent
      },
      {
        path: 'config/site',
        component: EstateConfigSiteComponent
      },
      {
        path: 'config/site/:LinkSiteId',
        component: EstateConfigSiteComponent
      },
      /*Config*/
      {
        path: 'property',
        component: EstatePropertyListComponent
      },
      {
        path: 'property/LinkPropertyTypeId/:LinkPropertyTypeId',
        component: EstatePropertyListComponent
      },
      /**/
      {
        path: 'property-type',
        component: EstatePropertyTypeListComponent
      },
      /**/
      {
        path: 'account-agency',
        component: EstateAccountAgencyListComponent
      },
      /**/    {
        path: 'account-user',
        component: EstateAccountUserListComponent
      },
      /**/
      {
        path: 'contract-type',
        component: EstateContractTypeListComponent
      },
      /**/
      {
        path: 'property-detail-group',
        component: EstatePropertyDetailGroupListComponent
      },
      /**/
      {
        path: 'property-detail',
        component: EstatePropertyDetailListComponent
      },
      {
        path: 'property-detail/LinkPropertyTypeId/:LinkPropertyTypeId',
        component: EstatePropertyDetailListComponent
      },
      /** */

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstateRoutes {
}
