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

  ngOnInit() {
    this.optionsFileUpload.onActions = {
      onActionSelect: (model) => this.onActionSelectFile(model),
    };
  }
  uploadedfileName = '';
  uploadedfileKey = '';
  optionsFileUpload=new ComponentOptionFileUploadModel();
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
