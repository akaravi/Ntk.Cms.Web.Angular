import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsRoutingModule } from './news-routing.module';
import { NewsComponent } from './news.component';
// import {CategoryResolver} from './category/tree/category.resolver';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import {TagInputModule} from 'ngx-chips';

import {
  CoreEnumService,
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
import { NewsCommentComponent } from './comment/comment.component';
import { NewsContentEditComponent } from './content/edit/edit.component';
import { NewsContentAddComponent } from './content/add/add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { TreeviewModule } from 'ngx-treeview';
import { SharedModule } from 'src/app/shared/shared.module';

import { ProgressSpinnerModule } from 'src/app/shared/progress-spinner/progress-spinner.module';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';
import { NewsCategorySelectorComponent } from './category/selector/selector.component';
import { NewsContentListComponent } from './content/list/list.component';
import { NewsCategoryTreeComponent } from './category/tree/tree.component';
import { NewsCommentListComponent } from './comment/list/list.component';
import { NewsCommentDeleteComponent } from './comment/delete/delete.component';
import { NewsCommentEditComponent } from './comment/edit/edit.component';

@NgModule({
  declarations: [
    NewsComponent,
    NewsContentAddComponent,
    NewsContentEditComponent,
    NewsContentListComponent,
    NewsCategoryTreeComponent,
    NewsCategorySelectorComponent,
    NewsCategoryEditComponent,
    NewsCategoryDeleteComponent,
    NewsCommentComponent,
    NewsCommentListComponent,
    NewsCommentDeleteComponent
    NewsCommentEditComponent
  ],
  imports: [
    NewsRoutingModule,
     CommonModule,
     FormsModule,
     ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    TreeviewModule.forRoot(),
    SharedModule.forRoot(),

    TagInputModule,
    LeafletModule,
    CKEditorModule,

    ProgressSpinnerModule,
    CmsFileManagerModule
  ],
  providers: [
    // CategoryResolver,
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
    CoreEnumService,
    // NodeClickedService
  ]
})
export class NewsModule { }
