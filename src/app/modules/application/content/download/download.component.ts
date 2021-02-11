import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApplicationAppModel } from 'ntk-cms-api';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class ApplicationAppDownloadComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public dateModel: ApplicationAppModel,
              private dialogRef: MatDialogRef<ApplicationAppDownloadComponent>,

  ) {
    console.log(dateModel);
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
