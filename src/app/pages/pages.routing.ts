import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'core',
        loadChildren: () =>
          import('../modules/core-main/core.module').then(m => m.CoreModule)
      },
      {
        path: 'coremodule',
        loadChildren: () =>
          import('../modules/core-module/coreModule.module').then(m => m.CoreModuleModule)
      },
      {
        path: 'coretoken',
        loadChildren: () =>
          import('../modules/core-token/coreToken.module').then(m => m.CoreTokenModule)
      },
      {
        path: 'corelog',
        loadChildren: () =>
          import('../modules/core-log/coreLog.module').then(m => m.CoreLogModule)
      },
      {
        path: 'apitelegram',
        loadChildren: () =>
          import('../modules/api-telegram/api-telegram.module').then(m => m.ApiTelegramModule)
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
        path: 'bankpayment',
        loadChildren: () =>
          import('../modules/bank-payment/bank-payment.module').then(m => m.BankPaymentModule)
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
          import('../modules/hyper-shop/hyperShop.module').then(m => m.HyperShopModule)
      },
      {
        path: 'linkmanagement',
        loadChildren: () =>
          import('../modules/link-management/linkManagement.module').then(m => m.LinkManagementModule)
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
          import('../modules/file-manager/filemanager.module').then(m => m.FileManagerModule)
      },
      {
        path: 'polling',
        loadChildren: () =>
          import('../modules/polling/polling.module').then(m => m.PollingModule)
      },
      {
        path: 'sms',
        loadChildren: () =>
          import('../modules/sms/sms.module').then(m => m.SmsModule)
      },
      {
        path: 'ticketing',
        loadChildren: () =>
          import('../modules/ticketing/ticketing.module').then(m => m.TicketingModule)
      },
      {
        path: 'universalmenu',
        loadChildren: () =>
          import('../modules/universal-menu/universalMenu.module').then(m => m.UniversalMenuModule)
      },
      {
        path: 'webdesigner',
        loadChildren: () =>
          import('../modules/web-designer/webDesigner.module').then(m => m.WebDesignerModule)
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
