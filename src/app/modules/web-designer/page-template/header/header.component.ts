import {
  CoreEnumService,
  EnumModel,
  ErrorExceptionResult,
  WebDesignerMainPageTemplateService,
  WebDesignerMainPageTemplateModel,
  DataFieldInfoModel,
} from 'ntk-cms-api';
import {
  Component,
  OnInit,
  Input,
} from '@angular/core';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';

@Component({
  selector: 'app-webdesigner-pagetemplate-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class WebDesignerMainPageTemplateHeaderComponent implements OnInit {
  constructor(
    private cmsStoreService: CmsStoreService,
    public coreEnumService: CoreEnumService,
    public webDesignerMainPageTemplateService: WebDesignerMainPageTemplateService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
  ) {

  }
  @Input() optionId = '';
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<WebDesignerMainPageTemplateModel> = new ErrorExceptionResult<WebDesignerMainPageTemplateModel>();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();

  storeSnapshot = this.cmsStoreService.getStateSnapshot();

  ngOnInit(): void {
    if (this.optionId.length > 0) {
      this.DataGetOneContent();
    }
    this.getEnumRecordStatus();
  }
  getEnumRecordStatus(): void {
    if (this.storeSnapshot &&
      this.storeSnapshot.EnumRecordStatus &&
      this.storeSnapshot.EnumRecordStatus &&
      this.storeSnapshot.EnumRecordStatus.IsSuccess &&
      this.storeSnapshot.EnumRecordStatus.ListItems &&
      this.storeSnapshot.EnumRecordStatus.ListItems.length > 0) {
      this.dataModelEnumRecordStatusResult = this.storeSnapshot.EnumRecordStatus;
    }
  }
  DataGetOneContent(): void {
    this.loading.display = true;
    this.webDesignerMainPageTemplateService.setAccessLoad();
    this.webDesignerMainPageTemplateService.ServiceGetOneById(this.optionId).subscribe(
      (next) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);
        if (next.IsSuccess) {
          this.dataModelResult = next;
        } else {
          this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
        }
        this.loading.display = false;
      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.display = false;
      }
    );
  }
}
