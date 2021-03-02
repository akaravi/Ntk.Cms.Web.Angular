import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreUserListComponent } from './list/list.component';
import { CoreUserComponent } from './coreUser.component';


const routes: Routes = [
  {
    path: '',
    component: CoreUserComponent,
    children: [
      {
        path: 'content',
        component: CoreUserListComponent
      },
      // {
      //   path: 'content/add/:CategoryId',
      //   component: UserContentAddComponent
      // },
      // {
      //   path: 'content/edit/:Id',
      //   component: UserContentEditComponent
      // },
      // {
      //   path: 'comment',
      //   component: UserCommentListComponent
      // },
      // {
      //   path: 'comment/:ContentId',
      //   component: UserCommentListComponent
      // },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreUserRouting {
}
