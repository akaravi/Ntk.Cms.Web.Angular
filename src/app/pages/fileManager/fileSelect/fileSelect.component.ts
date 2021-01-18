import { ErrorExceptionResult, FileUploadedModel } from 'ntk-cms-api';
import { Component, OnInit } from '@angular/core';
import { ComponentOptionFileUploadModel } from 'src/app/core/cmsComponentModels/files/componentOptionFileUploadModel';

@Component({
  selector: 'app-file-select',
  templateUrl: './fileSelect.component.html',
  styleUrls: ['./fileSelect.component.scss']
})
export class FileSelectComponent implements OnInit {

  constructor() { }
;
  public ajaxSettings: object;
  public enableRtl: boolean;
  public hostUrl: string = 'https://ej2-aspcore-service.azurewebsites.net/';







  uploadedfileName = '';
  uploadedfileKey = '';
  optionsFileUpload=new ComponentOptionFileUploadModel();
  public ngOnInit(): void {
    this.optionsFileUpload.childMethods = {
      onActionSelect: (model) => this.onActionSelectFile(model),
    };
      this.ajaxSettings = {
          url: this.hostUrl + 'api/FileManager/FileOperations',
           getImageUrl: this.hostUrl + 'api/FileManager/GetImage',
           uploadUrl: this.hostUrl + 'api/FileManager/Upload',
           downloadUrl: this.hostUrl + 'api/FileManager/Download'
      };
      this.enableRtl = true;
  }
  onActionSelectFile(model: ErrorExceptionResult<FileUploadedModel>): void {
    // console.log('model', model);
    if (model && !model.IsSuccess) {
      // this.message = 'خطا در دریافت عکس کپچا';
      return;
    }
    if (model && model.IsSuccess && model.Item.FileKey) {
      // this.modelTargetSetDto.UploadFileGUID = model.Item.FileKey;
      this.uploadedfileName = model.Item.FileName;
      if (this.uploadedfileKey.length > 0) {
        this.uploadedfileKey = this.uploadedfileKey + ',';
      }
      this.uploadedfileKey = this.uploadedfileKey + model.Item.FileKey;
    }
  }
}
