import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreTokenComponent } from './coreToken.component';
import { CoreTokenRoutes } from './coreToken.routing';
import { CoreTokenUserListComponent } from './user/list/list.component';
import { CoreTokenUserEditComponent } from './user/edit/edit.component';
import { CoreEnumService, CoreTokenUserService, CoreUserService } from 'ntk-cms-api';
import { CmsConfirmationDialogService } from 'src/app/shared/cmsConfirmationDialog/cmsConfirmationDialog.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

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
  ],
  providers: [
    CoreEnumService,
    CoreTokenUserService,
    CoreUserService,
    CmsConfirmationDialogService
  ]
})
export class CoreTokenModule { }
