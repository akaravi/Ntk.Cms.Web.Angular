import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { CoreSiteCategoryListComponent } from './list/list.component';
import { CoreSiteCategoryModuleListComponent } from './moduleList/moduleList.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CoreSiteCategoryListComponent
      },
         {
        path: 'modulelist/:Id',
        component: CoreSiteCategoryModuleListComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreSiteCategoryRouting {
}
