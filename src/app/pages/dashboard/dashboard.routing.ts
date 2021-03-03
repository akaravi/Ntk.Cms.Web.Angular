import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardOneComponent } from './one/one.component';
import { DashboardTwoComponent } from './two/two.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: DashboardOneComponent,
      },
      {
        path: 'one',
        component: DashboardOneComponent,
      },
      {
        path: 'two',
        component: DashboardTwoComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRouting {
}
