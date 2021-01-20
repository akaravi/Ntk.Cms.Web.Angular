import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {NewsComponent} from './news.component';
// import {CategoryResolver} from './category/tree/category.resolver';
import { NewsContentListComponent } from './content/list/list.component';
import { NewsCommentListComponent } from './comment/list/list.component';


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
        path: 'comment/:id',
        // resolve: {categoryList: CategoryResolver},
        // loadChildren: () =>    import('./content/content.module').then(m => m.ContentModule)
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
