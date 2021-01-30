import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationAppListComponent } from './app/list/list.component';
import { ApplicationComponent } from './application.component';
import { ApplicationIntroListComponent } from './intro/list/list.component';
import { ApplicationMemberInfoListComponent } from './memberInfo/list/list.component';
import { ApplicationNotificationListComponent } from './notification/list/list.component';
import { ApplicationSourceListComponent } from './source/list/list.component';
import { ApplicationThemeConfigListComponent } from './themeConfig/list/list.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationComponent,
    children: [
      {
        path: 'app',
        component: ApplicationAppListComponent
      },
      {
        path: 'intro',
        component: ApplicationIntroListComponent
      },
      {
        path: 'memberinfo',
        component: ApplicationMemberInfoListComponent
      },
      {
        path: 'notification',
        component: ApplicationNotificationListComponent
      },
      {
        path: 'source',
        component: ApplicationSourceListComponent
      },
      {
        path: 'themeconfig',
        component: ApplicationThemeConfigListComponent
      },


    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationRoutes {
}
