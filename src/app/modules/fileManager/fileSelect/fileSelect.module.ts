import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileSelectComponent } from './fileSelect.component';
import { FileUploadModule } from '../fileUpload/fileUpload.module';
import 'rxjs/add/operator/map';
import { CmsFileManagerModule } from 'ntk-cms-filemanager';



@NgModule({
  imports: [
    CommonModule,
    FileUploadModule,
    CmsFileManagerModule,

  ],
  declarations: [FileSelectComponent],
  exports:[FileSelectComponent],
  providers: []

})
export class FileSelectModule { }
