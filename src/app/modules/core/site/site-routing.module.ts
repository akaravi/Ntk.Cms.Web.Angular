import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { CoreSiteAddFirstComponent } from './addFirst/addFirst.component';
import {SelectionComponent} from './selection/selection.component';
import {SiteResolver} from './site.resolver';

const routes: Routes = [
  {
    path: '',
    resolve: { list: SiteResolver},
    children: [
      {
        path: 'selection',
        component: SelectionComponent
      },
      {
        path: 'addFirst',
        component: CoreSiteAddFirstComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiteRoutingModule {
}
