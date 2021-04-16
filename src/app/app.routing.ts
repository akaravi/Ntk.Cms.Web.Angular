import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CmsAuthGuard } from './core/services/cmsAuthGuard.service';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'test',
    loadChildren: () =>
      import('./testModules/test/test.module').then((m) => m.TestModule),

  },
  {
    path: 'barcode',
    loadChildren: () =>
      import('./testModules/barcode/barcode.module').then((m) => m.BarcodeModule),
  },
  {
    path: 'formbuilder',
    loadChildren: () =>
      import('./testModules/formbuilder/formbuilder.module').then((m) => m.FormBuilderModule),
  },
  {
    path: '',
    canActivate: [CmsAuthGuard],
    loadChildren: () =>
      import('./pages/pages.module').then((m) => m.PagesModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRouting { }
