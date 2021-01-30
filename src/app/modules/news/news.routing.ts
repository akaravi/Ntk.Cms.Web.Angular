import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewsComponent } from './news.component';
import { NewsContentListComponent } from './content/list/list.component';
import { NewsCommentListComponent } from './comment/list/list.component';
import { NewsCommentEditComponent } from './comment/edit/edit.component';
import { NewsContentEditComponent } from './content/edit/edit.component';
import { NewsContentAddComponent } from './content/add/add.component';


const routes: Routes = [
  {
    path: '',
    component: NewsComponent,
    children: [
      {
        path: 'content',
        // resolve: {categoryList: CategoryResolver},
        // loadChildren: () =>    import('./content/content.module').then(m => m.ContentModule)
        component: NewsContentListComponent
      },
      {
        path: 'content/add/:CategoryId',
        component: NewsContentAddComponent
      },
      {
        path: 'content/edit/:Id',
        component: NewsContentEditComponent
      },
      {
        path: 'comment',
        component: NewsCommentListComponent
      },
      {
        path: 'comment/:ContentId',
        component: NewsCommentListComponent
      },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsRouting {
}