import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationAppListComponent } from './content/list/list.component';
import { ApplicationComponent } from './application.component';
import { ApplicationIntroListComponent } from './intro/list/list.component';
import { ApplicationMemberInfoListComponent } from './memberInfo/list/list.component';
import { ApplicationNotificationListComponent } from './notification/list/list.component';
import { ApplicationSourceListComponent } from './source/list/list.component';
import { ApplicationThemeConfigListComponent } from './themeConfig/list/list.component';
import { ApplicationSourceAddComponent } from './source/add/add.component';
import { ApplicationSourceEditComponent } from './source/edit/edit.component';
import { ApplicationSourceDeleteComponent } from './source/delete/delete.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationComponent,
    children: [
      {
        path: 'source',
        component: ApplicationSourceListComponent
      },
      {
        path: 'source/add',
        component: ApplicationSourceAddComponent
      },
      {
        path: 'source/edit/:Id',
        component: ApplicationSourceEditComponent
      },
      {
        path: 'source/delete/:Id',
        component: ApplicationSourceDeleteComponent
      },
      {
        path: 'app',
        component: ApplicationAppListComponent
      },
      {
        path: 'app/:SourceId',
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
