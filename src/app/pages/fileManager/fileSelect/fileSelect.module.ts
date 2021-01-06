import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileSelectComponent } from './fileSelect.component';
import { FileUploadModule } from '../fileUpload/fileUpload.module';


@NgModule({
  imports: [
    CommonModule,
    FileUploadModule,

  ],
  declarations: [FileSelectComponent],
  exports:[FileSelectComponent],
  providers: []

})
export class FileSelectModule { }
