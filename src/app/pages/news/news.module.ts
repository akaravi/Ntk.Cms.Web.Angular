import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewsRoutingModule } from './news-routing.module';
import { NewsComponent } from './news.component';
import {CategoryResolver} from './category/category.resolver';
import {NewsCategoryService} from 'ntk-cms-api';

@NgModule({
  declarations: [NewsComponent],
  imports: [
    CommonModule,
    NewsRoutingModule,

  ],
  providers: [
    CategoryResolver,
    NewsCategoryService
  ]
})
export class NewsModule { }
