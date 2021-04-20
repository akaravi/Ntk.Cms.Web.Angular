import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationAppListComponent } from './content/list/list.component';
import { ApplicationComponent } from './application.component';
import { ApplicationIntroListComponent } from './intro/list/list.component';
import { ApplicationMemberInfoListComponent } from './memberInfo/list/list.component';
import { ApplicationSourceListComponent } from './source/list/list.component';
import { ApplicationThemeConfigListComponent } from './themeConfig/list/list.component';
import { ApplicationSourceAddComponent } from './source/add/add.component';
import { ApplicationSourceEditComponent } from './source/edit/edit.component';
import { ApplicationAppEditComponent } from './content/edit/edit.component';
import { ApplicationAppAddComponent } from './content/add/add.component';
import { ApplicationConfigMainAdminComponent } from './config/mainAdmin/configMainAdmin.component';
import { ApplicationConfigSiteComponent } from './config/site/configSite.component';
import { ApplicationLogNotificationListComponent } from './notification/list/list.component';
import { ApplicationIntroAddComponent } from './intro/add/add.component';
import { ApplicationIntroEditComponent } from './intro/edit/edit.component';


const routes: Routes = [
  {
    path: '',
    component: ApplicationComponent,
    children: [
      /*Config*/
      {
        path: 'config/mainadmin',
        component: ApplicationConfigMainAdminComponent
      },
      {
        path: 'config/site',
        component: ApplicationConfigSiteComponent
      },
      {
        path: 'config/site/:LinkSiteId',
        component: ApplicationConfigSiteComponent
      },
      /*Config*/
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
        path: 'app',
        component: ApplicationAppListComponent
      },
      {
        path: 'app/LinkSourceId/:LinkSourceId',
        component: ApplicationAppListComponent
      }, {
        path: 'app/LinkThemeConfigId/:LinkThemeConfigId',
        component: ApplicationAppListComponent
      },
      {
        path: 'app/add/:SourceId',
        component: ApplicationAppAddComponent
      },
      {
        path: 'app/edit/:Id',
        component: ApplicationAppEditComponent
      },
      {
        path: 'intro',
        component: ApplicationIntroListComponent
      },
      {
        path: 'intro/LinkApplicationId/:LinkApplicationId',
        component: ApplicationIntroListComponent
      },
      {
        path: 'intro/add/:LinkApplicationId',
        component: ApplicationIntroAddComponent
      },
      {
        path: 'intro/edit/:Id',
        component: ApplicationIntroEditComponent
      },
      {
        path: 'memberinfo',
        component: ApplicationMemberInfoListComponent
      },
      {
        path: 'memberinfo/LinkMemberId/:LinkMemberId',
        component: ApplicationMemberInfoListComponent
      },
      {
        path: 'memberinfo/LinkUserId/:LinkUserId',
        component: ApplicationMemberInfoListComponent
      },
      {
        path: 'memberinfo/LinkApplicationId/:LinkApplicationId',
        component: ApplicationMemberInfoListComponent
      },
      {
        path: 'notification',
        component: ApplicationLogNotificationListComponent
      },
      {
        path: 'notification/LinkApplicationId/:LinkApplicationId',
        component: ApplicationLogNotificationListComponent
      },
      {
        path: 'notification/LinkApplicationMemberId/:LinkApplicationMemberId',
        component: ApplicationLogNotificationListComponent
      },


      {
        path: 'themeconfig',
        component: ApplicationThemeConfigListComponent
      },
      {
        path: 'themeconfig/LinkSourceId/:LinkSourceId',
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
