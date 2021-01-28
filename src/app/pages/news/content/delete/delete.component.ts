import {
  Component,
  Inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreEnumService, ErrorExceptionResult, FormInfoModel, ItemState, NewsContentModel, NewsContentService } from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/helpers/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';

@Component({
  selector: 'app-news-content-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class NewsContentDeleteComponent implements OnInit {
  requestModel: NewsContentModel;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<NewsContentDeleteComponent>,
    public newsContentService: NewsContentService,
    public coreEnumService: CoreEnumService,
    private toasterService: CmsToastrService,) {
    if (data) {
      this.requestModel = data.model;
    }

  }

  @ViewChild('vform', { static: false })
  formGroup: FormGroup;
  loading = new ProgressSpinnerModel();
  ngOnInit(): void {
    if (this.requestModel) {
      this.toasterService.typeErrorDeleteRowIsNull();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
  }
  DataDeleteContent(): void {
    if (this.requestModel == null || this.requestModel.Id === 0) {
      const title = 'برروز خطا ';
      const message = 'ردیف اطلاعات جهت حذف مشخص نیست';
      this.toasterService.toastr.error(message, title);
      return;
    }
    this.newsContentService.ServiceDelete(this.requestModel.Id).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.toasterService.typeSuccessRemove();
          this.dialogRef.close({ dialogChangedDate: true });
        } else {
          this.toasterService.typeErrorRemove();
        }
      },
      (error) => {
        this.toasterService.typeErrorRemove(error);
      }
    );
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
