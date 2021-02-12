import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApplicationAppModel } from 'ntk-cms-api';

@Component({
  selector: 'app-upload-update',
  templateUrl: './uploadUpdate.component.html',
  styleUrls: ['./uploadUpdate.component.scss']
})
export class ApplicationAppUploadUpdateComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public dateModel: ApplicationAppModel,
              private dialogRef: MatDialogRef<ApplicationAppUploadUpdateComponent>,

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
}
