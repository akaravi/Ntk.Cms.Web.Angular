import { PollingContentListComponent } from './content/list/list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PollingComponent } from './ticketing.component';
import { PollingContentAddComponent } from './content/add/add.component';
import { PollingContentEditComponent } from './content/edit/edit.component';
import { PollingVoteListComponent } from './vote/list/list.component';



const routes: Routes = [
  {
    path: '',
    component: PollingComponent,
    children: [
      {
        path: 'content',
        // resolve: {categoryList: CategoryResolver},
        // loadChildren: () =>    import('./content/content.module').then(m => m.ContentModule)
        component: PollingContentListComponent
      },
      {
        path: 'content/add/:CategoryId',
        component: PollingContentAddComponent
      },
      {
        path: 'content/edit/:Id',
        component: PollingContentEditComponent
      },
      {
        path: 'vote',
        component: PollingVoteListComponent
      },
      {
        path: 'vote/:ContentId',
        component: PollingVoteListComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PollingRouting {
}
