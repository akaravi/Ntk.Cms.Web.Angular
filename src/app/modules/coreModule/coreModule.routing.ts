import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreModuleComponent } from './coreModule.component';


const routes: Routes = [
  {
    path: '',
    component: CoreModuleComponent,
    // children: [
    //   {
    //     path: 'content',
    //     // resolve: {categoryList: CategoryResolver},
    //     // loadChildren: () =>    import('./content/content.module').then(m => m.ContentModule)
    //     component: NewsContentListComponent
    //   },
    //   {
    //     path: 'content/add/:CategoryId',
    //     component: NewsContentAddComponent
    //   },
    //   {
    //     path: 'content/edit/:Id',
    //     component: NewsContentEditComponent
    //   },
    //   {
    //     path: 'comment',
    //     component: NewsCommentListComponent
    //   },
    //   {
    //     path: 'comment/:ContentId',
    //     component: NewsCommentListComponent
    //   },

    // ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreModuleRoutes {
}
