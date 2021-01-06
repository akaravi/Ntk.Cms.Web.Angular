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
import { ContentComponent } from './content/list/list.component';
import { CategoryComponent } from './category/tree/tree.component';
import { ProgressSpinnerModule } from 'src/app/shared/progress-spinner/progress-spinner.module';
import { FileUploadModule } from '../fileManager/fileUpload/fileUpload.module';
import { FileSelectModule } from '../fileManager/fileSelect/fileSelect.module';


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
    CategoryComponent,

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

    QueryBuilderModule,
    ProgressSpinnerModule,
    FileUploadModule,
    FileSelectModule
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
    CoreEnumService
  ]
})
export class NewsModule { }
