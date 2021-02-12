import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilePreviewModel } from 'ngx-awesome-uploader';
import { ApplicationAppModel } from 'ntk-cms-api';

@Component({
  selector: 'app-upload-app',
  templateUrl: './uploadApp.component.html',
  styleUrls: ['./uploadApp.component.scss']
})
export class ApplicationAppUploadAppComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public dateModel: ApplicationAppModel,
              private dialogRef: MatDialogRef<ApplicationAppUploadAppComponent>,

  ) {
  }

  ngOnInit(): void {
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
  onActionDownloadApp(): void{
    window.open(this.dateModel.DownloadLinkSrc);

  }
  onActionDownloadUpdate(): void{
    window.open(this.dateModel.DownloadLinkUpdateSrc);

  }
  OnActionUploadSuccess(model: FilePreviewModel): void{
console.log(model);
  }
}
