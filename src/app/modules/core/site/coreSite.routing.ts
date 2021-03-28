import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreSiteAddFirstComponent } from './addFirst/addFirst.component';
import { SelectionComponent } from './selection/selection.component';
import { CoreSiteResolver } from './coreSite.resolver';
import { CoreSiteListComponent } from './list/list.component';
import { CoreSiteEditComponent } from './edit/edit.component';
import { CoreSiteModuleListComponent } from './moduleList/moduleList.component';
import { CoreSiteDomainAliasListComponent } from './domainAliasList/domainAliasList.component';

const routes: Routes = [
  {
    path: '',
    resolve: { list: CoreSiteResolver },
    children: [
      {
        path: '',
        component: CoreSiteListComponent
      },
      {
        path: 'selection',
        component: SelectionComponent
      },
      {
        path: 'addFirst',
        component: CoreSiteAddFirstComponent
      },
      {
        path: 'edit/:Id',
        component: CoreSiteEditComponent
      },
      {
        path: 'modulelist/:Id',
        component: CoreSiteModuleListComponent
      },
      {
        path: 'domainalias',
        component: CoreSiteDomainAliasListComponent
      }
      ,
      {
        path: 'domainalias/:Id',
        component: CoreSiteDomainAliasListComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreSiteRouting {
}
