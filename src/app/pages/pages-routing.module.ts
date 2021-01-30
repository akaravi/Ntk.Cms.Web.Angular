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
        path: 'news',
        loadChildren: () =>
          import('../modules/news/news.module').then(m => m.NewsModule)
      },
      {
        path: 'filemanager',
        loadChildren: () =>
          import('../modules/filemanager/filemanager.module').then(m => m.FileManagerModule)
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
