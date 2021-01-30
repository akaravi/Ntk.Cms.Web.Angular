import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './_layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'site',
        loadChildren: () =>
          import('../modules/core/site/site.module').then((m) => m.SiteModule),
      },
      {
        path: 'core',
        loadChildren: () =>
          import('../modules/core/core.module').then(m => m.CoreModule)
      },
      {
        path: 'coremodule',
        loadChildren: () =>
          import('../modules/coreModule/coreModule.module').then(m => m.CoreModuleModule)
      },
      {
        path: 'coretoken',
        loadChildren: () =>
          import('../modules/coreToken/coreToken.module').then(m => m.CoreTokenModule)
      },
      {
        path: 'news',
        loadChildren: () =>
          import('../modules/news/news.module').then(m => m.NewsModule)
      },
      {
        path: 'article',
        loadChildren: () =>
          import('../modules/article/article.module').then(m => m.ArticleModule)
      },
      {
        path: 'filemanager',
        loadChildren: () =>
          import('../modules/filemanager/filemanager.module').then(m => m.FileManagerModule)
      },
      {
        path: 'application',
        loadChildren: () =>
          import('../modules/application/application.module').then(m => m.ApplicationModule)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
