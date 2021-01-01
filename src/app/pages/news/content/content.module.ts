import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentRoutingModule } from './content-routing.module';
import { ContentComponent } from './content.component';
import {CategoryModule} from '../category/category.module';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';
import {ContentResolver} from './content.resolver';
import {NewsContentService} from 'ntk-cms-api';
import {QueryBuilderModule} from 'angular2-query-builder';
import {FormsModule} from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@NgModule({
  declarations: [ContentComponent],
  imports: [
    CommonModule,
    ContentRoutingModule,
    CategoryModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    QueryBuilderModule,
    FormsModule,
    MatSlideToggleModule
  ],
  providers: [
    ContentResolver,
    NewsContentService
  ]
})
export class ContentModule { }
