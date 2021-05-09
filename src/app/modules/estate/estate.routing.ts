import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EstatePropertyTypeListComponent } from './property-type/list/list.component';
import { EstateConfigMainAdminComponent } from './config/mainAdmin/configMainAdmin.component';
import { EstateConfigSiteComponent } from './config/site/configSite.component';
import { EstatePropertyListComponent } from './Property/list/list.component';
import { EstateComponent } from './estate.component';
import { EstateContractTypeListComponent } from './contract-type/list/list.component';
import { EstatePropertyDetailGroupListComponent } from './property-detail-group/list/list.component';

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
        path: 'property-type',
        component: EstatePropertyTypeListComponent
      },
      /**/
      {
        path: 'contract-type',
        component: EstateContractTypeListComponent
      },
      /**/
      {
        path: 'content',
        component: EstatePropertyListComponent
      },
      /**/
      {
        path: 'property-detail-group',
        component: EstatePropertyDetailGroupListComponent
      },
      {
        path: 'content/PareintId/:PareintId',
        component: EstatePropertyListComponent
      },
      /**/
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstateRoutes {
}
