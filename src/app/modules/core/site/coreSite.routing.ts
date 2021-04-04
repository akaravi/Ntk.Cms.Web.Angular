import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreSiteAddFirstComponent } from './addFirst/addFirst.component';
import { CoreSiteSelectionComponent } from './selection/selection.component';
import { CoreSiteListComponent } from './list/list.component';
import { CoreSiteModuleListComponent } from './moduleList/moduleList.component';
import { CoreSiteModuleEditComponent } from './moduleEdit/moduleEdit.component';
import { CoreSiteModuleAddComponent } from './moduleAdd/moduleAdd.component';
import { CoreSiteAddComponent } from './add/add.component';
import { CoreSiteEditComponent } from './edit/edit.component';
import { CoreSiteUserListComponent } from './userList/userList.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CoreSiteListComponent
      },
      {
        path: 'list/:LinkUserId',
        component: CoreSiteListComponent
      },
      {
        path: 'selection',
        component: CoreSiteSelectionComponent
      },
      {
        path: 'addFirst',
        component: CoreSiteAddFirstComponent
      },
      {
        path: 'add',
        component: CoreSiteAddComponent
      },
      {
        path: 'edit/:Id',
        component: CoreSiteEditComponent
      },
      {
        path: 'modulelist',
        component: CoreSiteModuleListComponent
      },
      {
        path: 'modulelist/:Id',
        component: CoreSiteModuleListComponent
      },
      {
        path: 'moduleadd/:LinkSiteId',
        component: CoreSiteModuleAddComponent
      },
      {
        path: 'moduleadd/:LinkSiteId/:LinkModuleId',
        component: CoreSiteModuleAddComponent
      },
      {
        path: 'moduleedit/:LinkSiteId/:LinkModuleId',
        component: CoreSiteModuleEditComponent
      },
      {
        path: 'userlist/:LinkSiteId',
        component: CoreSiteUserListComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreSiteRouting {
}
