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
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutes {
}
