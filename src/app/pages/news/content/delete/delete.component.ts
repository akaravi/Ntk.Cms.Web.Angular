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
  requestId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<NewsContentDeleteComponent>,
    public newsContentService: NewsContentService,
    public coreEnumService: CoreEnumService,
    private toasterService: CmsToastrService, ) {
    if (data) {
      this.requestId = +data.id || 0;
    }

  }

  @ViewChild('vform', { static: false })
  formGroup: FormGroup;
  loading = new ProgressSpinnerModel();

  formInfo: FormInfoModel = new FormInfoModel();
  dataModelResult: ErrorExceptionResult<NewsContentModel> = new ErrorExceptionResult<NewsContentModel>();
  dataModelItemStates: Array<ItemState<any>> = new Array<ItemState<any>>();
  ngOnInit(): void {
    if (this.requestId <= 0) {
      this.toasterService.typeErrorDeleteRowIsNull();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }

    this.DataGetOne();
  }
  DataGetOne(): void {
    this.formInfo.FormAllowSubmit = false;
    this.formInfo.FormAlert = 'در حال دریافت اطلاعات از سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;

    this.newsContentService
      .ServiceGetOneById(this.requestId)
      .subscribe(
        async (next) => {
          this.loading.display = false;
          this.dataModelResult = next;
          this.formInfo.FormAllowSubmit = true;

          if (next.IsSuccess) {
            this.loading.display = false;
          } else {
            this.toasterService.typeErrorGetOne(next.ErrorMessage);
          }
        },
        (error) => {
          this.loading.display = false;
          this.formInfo.FormAllowSubmit = true;
          const title = 'برروی خطا در دریافت اطلاعات';
          this.toasterService.typeErrorGetOne(error);
        }
      );
  }
  DataDeleteContent(): void {
    if (this.requestId == null || this.requestId === 0) {
      const title = 'برروز خطا ';
      const message = 'ردیف اطلاعات جهت حذف مشخص نیست';
      this.toasterService.toastr.error(message, title);
      return;
    }

    this.formInfo.FormError = '';
    this.formInfo.FormAllowSubmit = false;
    this.dataModelItemStates.forEach((element) => {
      //
      element.ActionStart = true;
      this.newsContentService.ServiceDelete(element.Item.Id).subscribe(
        (next) => {
          // this.formInfo.FormAllowSubmit = true;
          // this.dataModelResult = next;
          element.ActionEnd = true;
          if (next.IsSuccess) {
            element.Message = 'حذف شد';
            element.Status = 'Ok';
          } else {
            element.Message = next.ErrorMessage;
            element.Status = 'Error';
          }
        },
        (error) => {
          element.ActionEnd = true;
          // this.formInfo.FormAllowSubmit = true;
          const title = 'برروی خطا در دریافت اطلاعات';
          this.toasterService.typeError(error);
          element.Message = title + ' : ';
          element.Status = 'Error';
        }
      );
      //
    });
  }
  onFormCancel(): void {
    this.formGroup.reset();
  }
}
