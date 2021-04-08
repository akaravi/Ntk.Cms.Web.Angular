import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreConfigMainAdminComponent } from './config/mainAdmin/configMainAdmin.component';
import { CoreConfigSiteComponent } from './config/site/configSite.component';
import { CoreComponent } from './core.component';



const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    children: [
      /*Config*/
      {
        path: 'config/mainadmin',
        component: CoreConfigMainAdminComponent
      },
      {
        path: 'config/site',
        component: CoreConfigSiteComponent
      },
      {
        path: 'config/site/:LinkSiteId',
        component: CoreConfigSiteComponent
      },
      /*Config*/
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
        path: 'sitecategorymodule',
        loadChildren: () =>
          import('./siteCategoryModule/coreSiteCategoryCmsModule.module').then((m) => m.CoreSiteCategoryCmsModuleModule),
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
        path: 'module',
        loadChildren: () =>
          import('./module/coreModule.module').then((m) => m.CoreModuleModule),
      },
      {
        path: 'location',
        loadChildren: () =>
          import('./location/coreLocation.module').then((m) => m.CoreLocationCmsModule),
      },
      {
        path: 'device',
        loadChildren: () =>
          import('./device/coreDevice.module').then((m) => m.CoreDeviceModule),
      }, {
        path: 'guide',
        loadChildren: () =>
          import('./guides/coreGuide.module').then((m) => m.CoreGuideCmsModule),
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
