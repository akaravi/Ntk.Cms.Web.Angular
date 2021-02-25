import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsRouting } from './news.routing';
import { NewsComponent } from './news.component';
import { TagInputModule } from 'ngx-chips';

import {
  CmsStore,
  CoreEnumService,
  CoreModuleTagService,
  EnumModel,
  ErrorExceptionResult,
  NewsCategoryService,
  NewsCommentService,
  NewsConfigurationService,
  NewsContentAndParameterValueService,
  NewsContentOtherInfoService,
  NewsContentParameterService,
  NewsContentParameterTypeService,
  NewsContentService,
  NewsContentSimilarService,
  NewsContentTagService,
  NewsShareMainAdminSettingService,
  NewsShareReciverCategoryService,
  NewsShareServerCategoryService
} from 'ntk-cms-api';
import { NewsCategoryEditComponent } from './category/edit/edit.component';
import { NewsCategoryDeleteComponent } from './category/delete/delete.component';
import { NewsContentEditComponent } from './content/edit/edit.component';
import { NewsContentAddComponent } from './content/add/add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeviewModule } from 'ngx-treeview';
import { SharedModule } from 'src/app/shared/shared.module';

import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import { NewsCategorySelectorComponent } from './category/selector/selector.component';
import { NewsContentListComponent } from './content/list/list.component';
import { NewsCategoryTreeComponent } from './category/tree/tree.component';
import { NewsCommentListComponent } from './comment/list/list.component';
import { NewsCommentDeleteComponent } from './comment/delete/delete.component';
import { NewsCommentEditComponent } from './comment/edit/edit.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NewsContentSelectorComponent } from './content/selector/selector.component';
import { NewsContentDeleteComponent } from './content/delete/delete.component';
import { NewsCategoryAddComponent } from './category/add/add.component';

@NgModule({
  declarations: [
    NewsComponent,
    NewsContentAddComponent,
    NewsContentEditComponent,
    NewsContentDeleteComponent,
    NewsContentListComponent,
    NewsContentSelectorComponent,
    NewsCategoryTreeComponent,
    NewsCategorySelectorComponent,
    NewsCategoryAddComponent,
    NewsCategoryEditComponent,
    NewsCategoryDeleteComponent,
    NewsCommentListComponent,
    NewsCommentDeleteComponent,
    NewsCommentEditComponent,
  ],
  imports: [
    CommonModule,
    NewsRouting,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    TreeviewModule.forRoot(),
    SharedModule.forRoot(),
    AngularEditorModule,
    TagInputModule,
    //ProgressSpinnerModule,
    CmsFileManagerModule
  ],
  providers: [
    CoreEnumService,
    CoreModuleTagService,
    NewsCategoryService,
    NewsCommentService,
    NewsConfigurationService,
    NewsContentService,
    NewsContentAndParameterValueService,
    NewsContentOtherInfoService,
    NewsContentParameterService,
    NewsContentParameterTypeService,
    NewsContentSimilarService,
    NewsContentTagService,
    NewsShareMainAdminSettingService,
    NewsShareReciverCategoryService,
    NewsShareServerCategoryService,

  ]
})
export class NewsModule { }
