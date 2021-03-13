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
        path: 'apitelegram',
        loadChildren: () =>
          import('../modules/apiTelegram/apiTelegram.module').then(m => m.ApiTelegramModule)
      },
      {
        path: 'application',
        loadChildren: () =>
          import('../modules/application/application.module').then(m => m.ApplicationModule)
      },
      {
        path: 'article',
        loadChildren: () =>
          import('../modules/article/article.module').then(m => m.ArticleModule)
      },
      {
        path: 'bankPayment',
        loadChildren: () =>
          import('../modules/bankPayment/bankPayment.module').then(m => m.BankPaymentModule)
      },
      {
        path: 'biography',
        loadChildren: () =>
          import('../modules/biography/biography.module').then(m => m.BiographyModule)
      },
      {
        path: 'blog',
        loadChildren: () =>
          import('../modules/blog/blog.module').then(m => m.BlogModule)
      },
      {
        path: 'hypershop',
        loadChildren: () =>
          import('../modules/hyperShop/hyperShop.module').then(m => m.HyperShopModule)
      },
      {
        path: 'linkmanagment',
        loadChildren: () =>
          import('../modules/linkManagment/linkManagment.module').then(m => m.LinkManagmentModule)
      },
      {
        path: 'member',
        loadChildren: () =>
          import('../modules/member/member.module').then(m => m.MemberModule)
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
        path: 'polling',
        loadChildren: () =>
          import('../modules/polling/polling.module').then(m => m.PollingModule)
      },
      {
        path: 'ticketing',
        loadChildren: () =>
          import('../modules/ticketing/ticketing.module').then(m => m.TicketingModule)
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
export class PagesRouting {
}
