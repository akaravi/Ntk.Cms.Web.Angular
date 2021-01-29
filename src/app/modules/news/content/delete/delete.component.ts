import {
  Component,
  Inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CoreEnumService, ErrorExceptionResult, FormInfoModel, ItemState, NewsContentModel, NewsContentService } from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/helpers/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';

@Component({
  selector: 'app-news-content-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class NewsContentDeleteComponent implements OnInit {
  requestId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<NewsContentDeleteComponent>,
    private activatedRoute: ActivatedRoute,
    private newsContentService: NewsContentService,
    private toastrService: CmsToastrService
  ) {
    if (data) {
      this.requestId = +data.id || 0;
    }
  }
  loading = new ProgressSpinnerModel();
  dataModelResultContent: ErrorExceptionResult<NewsContentModel> = new ErrorExceptionResult<NewsContentModel>();
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  formInfo: FormInfoModel = new FormInfoModel();
  ngOnInit(): void {
    if (this.requestId <= 0) {
      this.toastrService.typeErrorDeleteRowIsNull();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.DataGetOne();
  }

  DataGetOne(): void {
    if (this.requestId === 0) {
      this.toastrService.typeErrorDeleteRowIsNull();
      return;
    }
    this.formInfo.FormAlert = 'در حال لود اطلاعات';
    this.loading.display = true;
    this.newsContentService
      .ServiceGetOneById(this.requestId)
      .subscribe(
        (next) => {
          this.dataModelResultContent = next;
          if (!next.IsSuccess) {
            this.formInfo.FormAlert = 'برروز خطا';
            this.formInfo.FormError = next.ErrorMessage;
            this.formInfo.FormErrorStatus = true;
            this.toastrService.typeErrorGetOne();
          } else {
            this.formInfo.FormAlert = '';
          }
          this.loading.display = false;
        },
        (error) => {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormErrorStatus = true;
          this.toastrService.typeError(error);
          this.loading.display = false;
        }
      );

  }



  onFormDelete(): void {
    if (this.requestId === 0) {
      this.toastrService.typeErrorDeleteRowIsNull();
      return;
    }
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.FormAllowSubmit = false;
    this.formInfo.DisabledButtonSubmitted = true;
    this.loading.display = true;
    this.newsContentService
      .ServiceDelete(this.requestId)
      .subscribe(
        (next) => {
          this.formInfo.FormAllowSubmit = !next.IsSuccess;
          if (!next.IsSuccess) {
            this.formInfo.FormAlert = 'برروز خطا';
            this.formInfo.FormError = next.ErrorMessage;
            this.toastrService.typeErrorRemove();

          } else {
            this.formInfo.FormAlert = 'حذف با موفقیت انجام شد';
            this.toastrService.typeSuccessRemove();
            this.dialogRef.close({ dialogChangedDate: true });
          }
          this.formInfo.DisabledButtonSubmitted = false;
          this.loading.display = false;
        },
        (error) => {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormAllowSubmit = true;
          this.toastrService.typeError(error);
          this.formInfo.DisabledButtonSubmitted = false;
          this.loading.display = false;
        }
      );

  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
    this.loading.display = false;
  }
}
