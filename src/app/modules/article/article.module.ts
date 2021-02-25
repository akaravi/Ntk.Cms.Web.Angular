import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleRouting } from './article.routing';
import { ArticleComponent } from './article.component';
import {TagInputModule} from 'ngx-chips';

import {
  CoreEnumService,
  CoreModuleTagService,
  ArticleCategoryService,
  ArticleCommentService,
  ArticleConfigurationService,
  ArticleContentAndParameterValueService,
  ArticleContentOtherInfoService,
  ArticleContentParameterService,
  ArticleContentParameterTypeService,
  ArticleContentService,
  ArticleContentSimilarService,
  ArticleContentTagService,
  ArticleShareMainAdminSettingService,
  ArticleShareReciverCategoryService,
  ArticleShareServerCategoryService
} from 'ntk-cms-api';
import { ArticleCategoryEditComponent } from './category/edit/edit.component';
import { ArticleCategoryDeleteComponent } from './category/delete/delete.component';
import { ArticleContentEditComponent } from './content/edit/edit.component';
import { ArticleContentAddComponent } from './content/add/add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeviewModule } from 'ngx-treeview';
import { SharedModule } from 'src/app/shared/shared.module';

import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import { ArticleCategorySelectorComponent } from './category/selector/selector.component';
import { ArticleContentListComponent } from './content/list/list.component';
import { ArticleCategoryTreeComponent } from './category/tree/tree.component';
import { ArticleCommentListComponent } from './comment/list/list.component';
import { ArticleCommentDeleteComponent } from './comment/delete/delete.component';
import { ArticleCommentEditComponent } from './comment/edit/edit.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {ArticleContentSelectorComponent} from './content/selector/selector.component';
import { ArticleContentDeleteComponent } from './content/delete/delete.component';
import { ArticleCategoryAddComponent } from './category/add/add.component';

@NgModule({
  declarations: [
    ArticleComponent,
    ArticleContentAddComponent,
    ArticleContentEditComponent,
    ArticleContentDeleteComponent,
    ArticleContentListComponent,
    ArticleContentSelectorComponent,
    ArticleCategoryTreeComponent,
    ArticleCategorySelectorComponent,
    ArticleCategoryAddComponent,
    ArticleCategoryEditComponent,
    ArticleCategoryDeleteComponent,
    ArticleCommentListComponent,
    ArticleCommentDeleteComponent,
    ArticleCommentEditComponent,
  ],
  imports: [
    ArticleRouting,
     CommonModule,
     FormsModule,
     ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    TreeviewModule.forRoot(),
    SharedModule.forRoot(),
    AngularEditorModule ,
    TagInputModule,

    //ProgressSpinnerModule,
    CmsFileManagerModule
  ],
  providers: [
    // CategoryResolver,
    ArticleCategoryService,
    ArticleCommentService,
    ArticleConfigurationService,
    ArticleContentService,
    ArticleContentAndParameterValueService,
    ArticleContentOtherInfoService,
    ArticleContentParameterService,
    ArticleContentParameterTypeService,
    ArticleContentSimilarService,
    ArticleContentTagService,
    ArticleShareMainAdminSettingService,
    ArticleShareReciverCategoryService,
    ArticleShareServerCategoryService,
    CoreEnumService,
    CoreModuleTagService
  ]
})
export class ArticleModule { }
