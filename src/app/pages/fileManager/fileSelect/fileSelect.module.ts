import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileSelectComponent } from './fileSelect.component';
import { FileUploadModule } from '../fileUpload/fileUpload.module';
import { FileManagerModule, NavigationPaneService, ToolbarService, DetailsViewService  } from '@syncfusion/ej2-angular-filemanager';
import 'rxjs/add/operator/map';



@NgModule({
  imports: [
    CommonModule,
    FileUploadModule,
    FileManagerModule,

  ],
  declarations: [FileSelectComponent],
  exports:[FileSelectComponent],
  providers: [NavigationPaneService, ToolbarService, DetailsViewService]

})
export class FileSelectModule { }
