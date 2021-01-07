import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileSelectComponent } from './fileSelect.component';
import { FileUploadModule } from '../fileUpload/fileUpload.module';
import 'rxjs/add/operator/map';
import { FileManagerModule } from 'ntk-cms-filemanager';



@NgModule({
  imports: [
    CommonModule,
    FileUploadModule,
    FileManagerModule,

  ],
  declarations: [FileSelectComponent],
  exports:[FileSelectComponent],
  providers: []

})
export class FileSelectModule { }
