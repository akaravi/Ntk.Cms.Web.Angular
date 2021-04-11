import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreLogComponent } from './coreLog.component';
import { CoreLogErrorListComponent } from './error/list/list.component';
import { CoreLogSmsListComponent } from './sms/list/list.component';

const routes: Routes = [
  {
    path: '',
    component: CoreLogComponent,
    children: [
      {
        path: 'error',
        component: CoreLogErrorListComponent
      },
      {
        path: 'sms',
        component: CoreLogSmsListComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreLogRoutes {
}
