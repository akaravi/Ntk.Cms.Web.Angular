import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreTokenComponent } from './coreToken.component';
import { CoreTokenRoutes } from './coreToken.routing';
import { CoreTokenUserListComponent } from './user/list/list.component';
import { CoreTokenUserEditComponent } from './user/edit/edit.component';
import {
  CoreEnumService,
  CoreTokenUserBadLoginService,
  CoreTokenUserLogService,
  CoreTokenUserService,
  CoreUserService
} from 'ntk-cms-api';
import { CmsConfirmationDialogService } from 'src/app/shared/cmsConfirmationDialog/cmsConfirmationDialog.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreTokenUserLogListComponent } from './userLog/list/list.component';
import { CoreTokenUserLogEditComponent } from './userLog/edit/edit.component';
import { CoreTokenUserBadLoginListComponent } from './userBadLogin/list/list.component';
import { CoreTokenUserBadLoginEditComponent } from './userBadLogin/edit/edit.component';
import { CoreTokenUserViewComponent } from './user/view/view.component';
import { CoreTokenUserBadLoginViewComponent } from './userBadLogin/view/view.component';
import { CoreTokenUserLogViewComponent } from './userLog/view/view.component';

@NgModule({
  imports: [
    CoreTokenRoutes,
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    SharedModule.forRoot(),
  ],
  declarations: [
    CoreTokenComponent,
    CoreTokenUserListComponent,
    CoreTokenUserEditComponent,
    CoreTokenUserLogListComponent,
    CoreTokenUserLogEditComponent,
    CoreTokenUserBadLoginListComponent,
    CoreTokenUserBadLoginEditComponent,
    CoreTokenUserViewComponent,
    CoreTokenUserBadLoginViewComponent,
    CoreTokenUserLogViewComponent
  ],
  providers: [
    CoreEnumService,
    CoreTokenUserService,
    CoreTokenUserLogService,
    CoreTokenUserBadLoginService,
    CoreUserService,
    CmsConfirmationDialogService
  ]
})
export class CoreTokenModule { }
