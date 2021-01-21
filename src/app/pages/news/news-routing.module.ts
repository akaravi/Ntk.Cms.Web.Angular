import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewsComponent } from './news.component';
// import {CategoryResolver} from './category/tree/category.resolver';
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
        path: 'content/add/:parentId',
        component: NewsContentAddComponent
      },
      {
        path: 'content/edit/:id',
        component: NewsContentEditComponent
      },
      {
        path: 'comment',
        component: NewsCommentListComponent
      },
      {
        path: 'comment/:parentId',
        component: NewsCommentListComponent
      },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsRoutingModule {
}
