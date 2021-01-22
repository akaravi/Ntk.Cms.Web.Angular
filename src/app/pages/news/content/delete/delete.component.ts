import {
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CoreEnumService, FormInfoModel, ItemState, NewsContentModel, NewsContentService } from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/helpers/services/cmsToastr.service';

@Component({
  selector: 'app-news-content-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class NewsContentDeleteComponent implements OnInit {
  @Input()
  set options(model: any) {
    this.dateModleInput = model;
  }
  get options(): any {
    return this.dateModleInput;
  }
  @ViewChild('vform', { static: false })
  formGroup: FormGroup;
  private dateModleInput: any;
  dataModelContents: Array<NewsContentModel> = new Array<NewsContentModel>();
  dataModelItemStates: Array<ItemState<NewsContentModel>> = new Array<
    ItemState<NewsContentModel>
  >();
  formInfo: FormInfoModel = new FormInfoModel();
  constructor(
    public newsContentService: NewsContentService,
    public coreEnumService: CoreEnumService,
    private toastrService: CmsToastrService,
  ) { }

  ngOnInit(): void {
    if (this.dateModleInput && this.dateModleInput.Contents) {
      this.dataModelContents = this.dateModleInput.Contents;
    }

    this.DataGetListContent();
  }
  DataGetListContent(): void {
    if (this.dataModelContents == null || this.dataModelContents.length === 0) {
      this.toastrService.typeErrorDeleteRowIsNull()
      return;
    }

    this.formInfo.FormError = '';
    this.dataModelContents.forEach((element) => {
      this.dataModelItemStates.push({
        ActionStart: false,
        ActionEnd: false,
        Item: element,
        Status: '',
        Message: '',
      });
    });
  }
  DataDeleteContent(): void {
    if (this.dataModelContents == null || this.dataModelContents.length === 0) {
      const title = 'برروز خطا ';
      const message = 'ردیف اطلاعات جهت حذف مشخص نیست';
      this.toastrService.toastr.error(message, title);
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
          this.toastrService.typeError(error);
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
