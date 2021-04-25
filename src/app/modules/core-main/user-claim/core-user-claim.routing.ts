import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreUserClaimContentListComponent } from './content/list/list.component';
import { CoreUserClaimGroupDetailListComponent } from './group-detail/list/list.component';
import { CoreUserClaimGroupListComponent } from './group/list/list.component';
import { CoreUserClaimTypeListComponent } from './type/list/list.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'group',
        component: CoreUserClaimGroupListComponent
      },
      {
        path: 'groupdetail',
        component: CoreUserClaimGroupDetailListComponent
      },
      {
        path: 'type',
        component: CoreUserClaimTypeListComponent
      },
      {
        path: 'content',
        component: CoreUserClaimContentListComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreUserClaimRouting {
}
