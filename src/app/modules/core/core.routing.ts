import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreComponent } from './core.component';



const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    children: [
      {
        path: 'user',
        loadChildren: () =>
          import('./user/coreUser.module').then((m) => m.CoreUserModule),
      },
      {
        path: 'site',
        loadChildren: () =>
          import('./site/coreSite.module').then((m) => m.CoreSiteModule),
      },
      {
        path: 'sitecategory',
        loadChildren: () =>
          import('./siteCategory/coreSiteCategory.module').then((m) => m.CoreSiteCategoryCmsModule),
      },
      {
        path: 'sitedomainalias',
        loadChildren: () =>
          import('./siteDomainAlias/coreSiteDomainAlias.module').then((m) => m.CoreSiteDomainAliasModule),
      },
      {
        path: 'cpmainmenu',
        loadChildren: () =>
          import('./cpMainMenu/coreCpMainMenu.module').then((m) => m.CoreCpMainMenu),
      },
      {
        path: 'location',
        loadChildren: () =>
          import('./location/coreLocation.module').then((m) => m.CoreLocationCmsModule),
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutes {
}
