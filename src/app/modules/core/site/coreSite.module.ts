import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreSiteRouting } from './coreSite.routing';
import { CoreSiteComponent } from './coreSite.component';
import { CoreModuleService, CoreModuleSiteService, CoreSiteCategoryCmsModuleService, CoreSiteCategoryService, CoreSiteService } from 'ntk-cms-api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectionComponent } from './selection/selection.component';
import { CoreSiteAddFirstComponent } from './addFirst/addFirst.component';
import { CoreSiteResolver } from './coreSite.resolver';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreSiteTreeComponent } from './tree/tree.component';
import { CoreSiteSelectorComponent } from './selector/selector.component';
import { CoreSiteDeleteComponent } from './delete/delete.component';
import { CoreSiteEditComponent } from './edit/edit.component';
import { CoreSiteAddComponent } from './add/add.component';
import { CoreSiteListComponent } from './list/list.component';
import { TreeviewModule } from 'ngx-treeview';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TagInputModule } from 'ngx-chips';
import { CoreSiteCategoryCmsModule } from '../siteCategory/coreSiteCategory.module';
import { CoreSiteCategoryCmsModuleModule } from '../siteCategoryModule/coreSiteCategoryCmsModule.module';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import { CoreSiteModuleListComponent } from './moduleList/moduleList.component';


@NgModule({
  declarations: [
    CoreSiteComponent,
    CoreSiteAddFirstComponent,
    SelectionComponent,
    CoreSiteListComponent,
    CoreSiteAddComponent,
    CoreSiteEditComponent,
    CoreSiteDeleteComponent,
    CoreSiteSelectorComponent,
    CoreSiteTreeComponent,
    CoreSiteModuleListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    CoreSiteRouting,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    TreeviewModule.forRoot(),
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
    CoreSiteCategoryCmsModule,
    CoreSiteCategoryCmsModuleModule,
    CmsFileManagerModule,
  ],
  providers: [
    CoreSiteService,
    CoreSiteCategoryCmsModuleService,
    CoreModuleService,
    CoreSiteCategoryService,
    CoreSiteResolver,
    CoreModuleSiteService
  ]
})
export class CoreSiteModule {
}
