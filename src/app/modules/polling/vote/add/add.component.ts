import {
  CoreEnumService,
  EnumModel,
  ErrorExceptionResult,
  FormInfoModel,
  PollingVoteService,
  PollingVoteModel,
} from 'ntk-cms-api';
import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  Inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ComponentActionEnum } from 'src/app/core/helpers/model/component-action-enum';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';


@Component({
  selector: 'app-news-comment-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class PollingVoteAddComponent implements OnInit {
  requestParentId = 0;
  requestContentId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PollingVoteAddComponent>,
    public coreEnumService: CoreEnumService,
    public pollingVoteService: PollingVoteService,
    private cmsToastrService: CmsToastrService
  ) {
    if (data) {
      this.requestParentId = +data.parentId || 0;
      this.requestContentId = +data.contentId || 0;
    }


  }

  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<PollingVoteModel> = new ErrorExceptionResult<PollingVoteModel>();
  dataModel: PollingVoteModel = new PollingVoteModel();
  @ViewChild('vform', { static: false }) formGroup: FormGroup;

  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();

  selected: any;
  openFormFileManager = false;

  ngOnInit(): void {
    
    this.getEnumRecordStatus();
  }

  getEnumRecordStatus(): void {
    this.loading.display = true;
    this.coreEnumService.ServiceEnumRecordStatus().subscribe((res) => {
      this.dataModelEnumRecordStatusResult = res;
      this.loading.display = false;
    });
  }

  DataAddContent(): void {
    this.formInfo.FormAlert = 'در حال ارسال اطلاعات به سرور';
    this.formInfo.FormError = '';
    this.loading.display = true;
    if (this.requestParentId > 0) {
      this.dataModel.LinkPollingContentId = this.requestParentId;
    }
    this.dataModel.LinkPollingContentId = this.requestContentId;
    this.pollingVoteService.ServiceAdd(this.dataModel).subscribe(
      (next) => {
        this.formInfo.FormAllowSubmit = true;
        this.dataModelResult = next;
        if (next.IsSuccess) {
          this.formInfo.FormAlert = 'ثبت با موفقیت انجام شد';
          this.cmsToastrService.typeSuccessAdd();
          this.dialogRef.close({ dialogChangedDate: true });
        } else {
          this.formInfo.FormAlert = 'برروز خطا';
          this.formInfo.FormError = next.ErrorMessage;
        }
        this.loading.display = false;
      },
      (error) => {
        this.formInfo.FormAllowSubmit = true;
        this.cmsToastrService.typeError(error);
        this.loading.display = false;
      }
    );
  }
  
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.FormAllowSubmit = false;
    
      this.DataAddContent();
    
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
