import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  CoreAuthService,
  EnumSortType,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  FileCategoryModel,
  FileContentModel,
  FileContentService,
  TokenInfoModel,
} from 'ntk-cms-api';
import { PublicHelper } from '../../../../core/helpers/publicHelper';
import { CmsToastrService } from '../../../../core/services/cmsToastr.service';
import { MatDialog } from '@angular/material/dialog';
import { ProgressSpinnerModel } from '../../../../core/models/progressSpinnerModel';
import { ComponentOptionSearchModel } from 'src/app/core/cmsComponentModels/base/componentOptionSearchModel';
import { ComponentOptionStatistModel } from 'src/app/core/cmsComponentModels/base/componentOptionStatistModel';
import { ComponentOptionExportModel } from 'src/app/core/cmsComponentModels/base/componentOptionExportModel';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FileContentDeleteComponent } from '../delete/delete.component';

@Component({
  selector: 'app-file-content-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class FileContentListComponent implements OnInit {

  constructor(
    private coreAuthService: CoreAuthService,
    public publicHelper: PublicHelper,
    private fileContentService: FileContentService,
    private toastrService: CmsToastrService,
    private router: Router,
    public dialog: MatDialog
  ) {
    // this.optionsCategoryTree.parentMethods = {
    //   onActionSelect: (x) => this.onActionCategorySelect(x),
    // };

    this.optionsSearch.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionsSearch(model),
    };

  }
  filteModelContent = new FilterModel();
  categoryModelSelected: FileCategoryModel;
  dataModelResult: ErrorExceptionResult<FileContentModel> = new ErrorExceptionResult<FileContentModel>();

  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  optionsExport: ComponentOptionExportModel = new ComponentOptionExportModel();
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<FileContentModel> = [];
  tableRowSelected: FileContentModel = new FileContentModel();
  tableSource: MatTableDataSource<FileContentModel> = new MatTableDataSource<FileContentModel>();
  tabledisplayedColumns: string[] = [
    'Id',
    'RecordStatus',
    'FileName',
    'Extension',
    'CreatedDate',
    'UpdatedDate',
    'Action'
  ];
  ngOnInit(): void {
    this.coreAuthService.CurrentTokenInfoBSObs.subscribe((next) => {
      this.DataGetAll();
      this.tokenInfo = next;
    });
  }
  DataGetAll(): void {
    this.tableRowsSelected = [];
    this.tableRowSelected = new FileContentModel();

    this.loading.display = true;
    this.loading.Globally = false;
    this.filteModelContent.AccessLoad = true;
    this.fileContentService.ServiceGetAll(this.filteModelContent).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelResult = next;
          this.tableSource.data = next.ListItems;
          if (this.tokenInfo.UserAccessAdminAllowToAllData) {
            this.tabledisplayedColumns = this.publicHelper.listAddIfNotExist(
              this.tabledisplayedColumns,
              'LinkSiteId',
              0
            );
          } else {
            this.tabledisplayedColumns = this.publicHelper.listRemoveIfExist(
              this.tabledisplayedColumns,
              'LinkSiteId'
            );
          }
          if (this.optionsSearch.childMethods) {
            this.optionsSearch.childMethods.setAccess(next.Access);
          }
        }
        this.loading.display = false;
      },
      (error) => {
        this.toastrService.typeError(error);

        this.loading.display = false;
      }
    );
  }

  onTableSortData(sort: MatSort): void {
    if (this.tableSource && this.tableSource.sort && this.tableSource.sort.active === sort.active) {
      if (this.tableSource.sort.start === 'asc') {
        sort.start = 'desc';
        this.filteModelContent.SortColumn = sort.active;
        this.filteModelContent.SortType = EnumSortType.Descending;
      } else if (this.tableSource.sort.start === 'desc') {
        this.filteModelContent.SortColumn = '';
        this.filteModelContent.SortType = EnumSortType.Ascending;
      } else {
        sort.start = 'desc';
      }
    } else {
      this.filteModelContent.SortColumn = sort.active;
      this.filteModelContent.SortType = EnumSortType.Ascending;
    }
    this.tableSource.sort = sort;
    this.filteModelContent.CurrentPageNumber = 0;
    this.DataGetAll();
  }
  onTablePageingData(event?: PageEvent): void {
    this.filteModelContent.CurrentPageNumber = event.pageIndex + 1;
    this.filteModelContent.RowPerPage = event.pageSize;
    this.DataGetAll();
  }

  onActionCategorySelect(model: FileCategoryModel | null): void {
    this.filteModelContent = new FilterModel();
    this.categoryModelSelected = model;
    if (model && model.Id > 0) {
      const aaa = {
        PropertyName: 'LinkCategoryId',
        IntValue1: model.Id,
      };
      this.filteModelContent.Filters.push(aaa as FilterDataModel);
    } else {
      // this.optionsCategoryTree.childMethods.ActionSelectForce(0);
    }
    this.DataGetAll();
  }

  onActionbuttonNewRow(): void {
    if (
      this.categoryModelSelected == null ||
      this.categoryModelSelected.Id === 0
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
    this.router.navigate(['/file/content/add', this.categoryModelSelected.Id]);
  }

  onActionbuttonEditRow(model: FileContentModel = this.tableRowSelected): void {
    if (!model ||!model.Id || model.Id === 0) {
      const title = 'برروز خطا ';
      const message = 'ردیفی برای ویرایش انتخاب نشده است';
      this.toastrService.toastr.error(message, title);
      return;
    }
    this.tableRowSelected=model;
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
    this.router.navigate(['/file/content/edit', this.tableRowSelected.Id]);
  }
  onActionbuttonDeleteRow(model: FileContentModel = this.tableRowSelected): void {
    if (!model ||!model.Id || model.Id === 0) {
      const title = 'برروز خطا ';
      const message = 'ردیفی برای ویرایش انتخاب نشده است';
      this.toastrService.toastr.error(message, title);
      return;
    }
    this.tableRowSelected=model;

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
    const dialogRef = this.dialog.open(FileContentDeleteComponent, { data: { id: this.tableRowSelected.Id } });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
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
  onActionTableRowSelect(row: FileContentModel): void {
    this.tableRowSelected = row;
  }
  onClickDownload(row: FileContentModel): void {
    this.router.navigate(['/file/comment/']);
  }
}
