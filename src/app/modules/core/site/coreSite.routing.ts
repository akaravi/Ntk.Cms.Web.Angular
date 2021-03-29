import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreSiteAddFirstComponent } from './addFirst/addFirst.component';
import { SelectionComponent } from './selection/selection.component';
import { CoreSiteResolver } from './coreSite.resolver';
import { CoreSiteListComponent } from './list/list.component';
import { CoreSiteModuleListComponent } from './moduleList/moduleList.component';

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
        path: 'modulelist',
        component: CoreSiteModuleListComponent
      },
      {
        path: 'modulelist/:Id',
        component: CoreSiteModuleListComponent
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
