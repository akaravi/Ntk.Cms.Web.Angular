import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsRoutingModule } from './news-routing.module';
import { NewsComponent } from './news.component';
import {CategoryResolver} from './category/category.resolver';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import {TagInputModule} from 'ngx-chips';

import {
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
import { NewsCategoryListComponent } from './category/list/list.component';
import { NewsCategoryEditComponent } from './category/edit/edit.component';
import { NewsCategorySelectComponent } from './category/select/select.component';
import { NewsCategoryDeleteComponent } from './category/delete/delete.component';
import { NewsCommentComponent } from './comment/comment.component';
import { NewsContentEditComponent } from './content/edit/edit.component';
import { NewsContentAddComponent } from './content/add/add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { TreeviewModule } from 'ngx-treeview';
import { SharedModule } from 'src/app/shared/shared.module';
import { QueryBuilderModule } from 'angular2-query-builder';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ContentComponent } from './content/content.component';
import { CategoryComponent } from './category/category.component';

@NgModule({
  declarations: [
    NewsComponent,
    NewsContentAddComponent,
    NewsContentEditComponent,
    NewsCategoryListComponent,
    NewsCategoryEditComponent,
    NewsCategorySelectComponent,
    NewsCategoryDeleteComponent,
    NewsCommentComponent,
    ContentComponent,
    CategoryComponent
  ],
  imports: [
    NewsRoutingModule,
     CommonModule,
     FormsModule,
    ReactiveFormsModule,
    TreeviewModule.forRoot(),
    SharedModule.forRoot(),

    TagInputModule,
    LeafletModule,
    CKEditorModule,

    QueryBuilderModule,


  ],
  providers: [
    CategoryResolver,
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
