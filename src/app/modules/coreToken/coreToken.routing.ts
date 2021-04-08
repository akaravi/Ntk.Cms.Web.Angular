import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreTokenComponent } from './coreToken.component';
import { CoreTokenUserListComponent } from './user/list/list.component';



const routes: Routes = [
  {
    path: '',
    component: CoreTokenComponent,
    children: [
      {
        path: 'user',
        component: CoreTokenUserListComponent
      },
      {
        path: 'user/:LinkSiteId',
        component: CoreTokenUserListComponent
      },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreTokenRoutes {
}
