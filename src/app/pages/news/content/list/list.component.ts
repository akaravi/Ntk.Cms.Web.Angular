import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CoreAuthService,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  NewsCategoryModel,
  NewsContentModel,
  NewsContentService,
  TokenInfoModel,
} from 'ntk-cms-api';
import { PublicHelper } from '../../../../_helpers/services/publicHelper';
import { ComponentOptionSearchContentModel } from 'src/app/core/cmsComponentModels/base/componentOptionSearchContentModel';
import { ComponentModalDataModel } from 'src/app/core/cmsComponentModels/base/componentModalDataModel';
import { CmsToastrService } from '../../../../_helpers/services/cmsToastr.service';
import { MatDialog } from '@angular/material/dialog';
import { NewsContentAddComponent } from '../add/add.component';
import { ProgressSpinnerModel } from '../../../../core/models/progressSpinnerModel';
import { ComponentOptionStatistContentModel } from 'src/app/core/cmsComponentModels/base/componentOptionStatistContentModel';
import { filter } from 'rxjs/operators';
import { ComponentOptionExportContentModel } from 'src/app/core/cmsComponentModels/base/componentOptionExportContentModel';
import { ComponentOptionTreeModel } from 'src/app/core/cmsComponentModels/base/componentOptionTreeModel';
import { ComponentOptionSelectorModel } from 'src/app/core/cmsComponentModels/base/componentOptionSelectorModel';


@Component({
  selector: 'app-news-content-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ContentComponent implements OnInit {
  filteModelContent = new FilterModel();
  filteModelCategory = new FilterModel();
  dataModelResult: ErrorExceptionResult<NewsContentModel> = new ErrorExceptionResult<NewsContentModel>();
  optionsCategoryTree: ComponentOptionTreeModel<NewsCategoryModel> = new ComponentOptionTreeModel<NewsCategoryModel>();
  modalModel: ComponentModalDataModel = new ComponentModalDataModel();
  optionsSearch: ComponentOptionSearchContentModel = new ComponentOptionSearchContentModel();
  optionsStatist: ComponentOptionStatistContentModel = new ComponentOptionStatistContentModel();
  optionsExport: ComponentOptionExportContentModel = new ComponentOptionExportContentModel();
  tableContentloading = false;
  tableRowsSelected: Array<NewsContentModel> = [];
  tableRowSelected: NewsContentModel = new NewsContentModel();
  // dateObject: any;
  loading = new ProgressSpinnerModel();
  tokenInfo = new TokenInfoModel();

  displayedColumns: string[] = [
    'LinkMainImageIdSrc',
    'RecordStatus',
    'Title',
    'CreatedDate',
    'UpdatedDate',
  ];
  // dataSource: any;

  constructor(
    private coreAuthService: CoreAuthService,
    private activatedRoute: ActivatedRoute,
    public publicHelper: PublicHelper,
    private newsContentService: NewsContentService,
    private toastrService: CmsToastrService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.optionsCategoryTree.parentMethods = {
      onActionSelect: (x) => this.onActionCategorySelect(x),
    };

    this.optionsSearch.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionsSearch(model),
    };
  }

  ngOnInit(): void {
    this.coreAuthService.CurrentTokenInfoBSObs.subscribe((next) => {
      this.DataGetAll();
      this.tokenInfo = next;
    });
  }

  DataGetAll(): void {
    this.tableRowsSelected = [];
    this.tableRowSelected = new NewsContentModel();
    this.tableContentloading = true;
    this.loading.display = true;
    this.loading.Globally = false;
    this.filteModelContent.AccessLoad = true;
    this.newsContentService.ServiceGetAll(this.filteModelContent).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelResult = next;
          if (this.tokenInfo.UserAccessAdminAllowToAllData) {
            this.displayedColumns = this.publicHelper.listAddIfNotExist(
              this.displayedColumns,
              'LinkSiteId',
              0
            );
          } else {
            this.displayedColumns = this.publicHelper.listRemoveIfExist(
              this.displayedColumns,
              'LinkSiteId'
            );
          }
          if (this.optionsSearch.childMethods) {
            this.optionsSearch.childMethods.setAccess(next.Access);
          }
        }
        this.tableContentloading = false;
        this.loading.display = false;
      },
      (error) => {
        this.toastrService.typeError(error);
        this.tableContentloading = false;
        this.loading.display = false;
      }
    );
  }

  onActionCategorySelect(model: NewsCategoryModel | null): void {
    this.filteModelContent = new FilterModel();

    if (model && model.Id > 0) {
      const aaa = {
        PropertyName: 'LinkCategoryId',
        IntValue1: model.Id,
      };
      this.filteModelContent.Filters.push(aaa as FilterDataModel);
    } else {
      this.optionsCategoryTree.childMethods.ActionSelectForce(0);
    }
    this.DataGetAll();
  }

  onActionbuttonNewRow(): void {
    if (
      this.optionsCategoryTree == null ||
      this.optionsCategoryTree.data == null ||
      this.optionsCategoryTree.data.Select == null ||
      this.optionsCategoryTree.data.Select.Id === 0
    ) {
      const title = 'برروز خطا ';
      const message = 'دسته بندی انتخاب نشده است';
      this.toastrService.toastr.error(message, title);
      return;
    }
    if (
      this.dataModelResult == null ||
      this.dataModelResult.Access == null ||
      !this.dataModelResult.Access.AccessAddRow
    ) {
      const title = 'برروز خطا ';
      const message = 'شما دسترسی برای اضافه کردن ندارید';
      this.toastrService.toastr.error(message, title);
      return;
    }
    this.router.navigate(['add'], {
      relativeTo: this.activatedRoute,
      queryParams: { parentId: this.optionsCategoryTree.data.Select.Id },
    });
  }

  onActionbuttonEditRow(): void {
    if (this.tableRowSelected == null || this.tableRowSelected.Id === 0) {
      const title = 'برروز خطا ';
      const message = 'ردیفی برای ویرایش انتخاب نشده است';
      this.toastrService.toastr.error(message, title);
      return;
    }
    if (
      this.dataModelResult == null ||
      this.dataModelResult.Access == null ||
      !this.dataModelResult.Access.AccessEditRow
    ) {
      const title = 'برروز خطا ';
      const message = 'شما دسترسی برای ویرایش ندارید';
      this.toastrService.toastr.error(message, title);
      return;
    }

    this.router.navigate(['edit'], {
      relativeTo: this.activatedRoute,
      queryParams: { id: this.tableRowSelected.Id },
    });
  }
  onActionbuttonDeleteRow(): void {
    if (this.tableRowSelected == null || this.tableRowSelected.Id === 0) {
      const title = 'برروز خطا ';
      const message = 'ردیفی برای ویرایش انتخاب نشده است';
      this.toastrService.toastr.error(message, title);
      return;
    }
    if (
      this.dataModelResult == null ||
      this.dataModelResult.Access == null ||
      !this.dataModelResult.Access.AccessDeleteRow
    ) {
      const title = 'برروز خطا ';
      const message = 'شما دسترسی برای حذف ندارید';
      this.toastrService.toastr.error(message, title);
      return;
    }
    const dialogRef = this.dialog.open(NewsContentAddComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  onActionbuttonStatist(): void {

    this.optionsStatist.childMethods.runStatist(this.filteModelContent.Filters);
  }
  onActionbuttonExport(): void {
    this.optionsExport.data.show = !this.optionsExport.data.show;
    this.optionsExport.childMethods.runExport(this.filteModelContent.Filters);
  }

  onActionbuttonReload(): void {
    this.DataGetAll();
  }
  onSubmitOptionsSearch(model: any): void {
    this.filteModelContent.Filters = model;
    this.DataGetAll();
  }
  onActionTableRowSelect(row: NewsContentModel): void {
    this.tableRowSelected = row;
  }

  onClickComment(id: number): void {
    this.router.navigate(['news/comment/', id]);
  }
}
