import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CoreAuthService,
  EnumSortType,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  NewsCategoryModel,
  NewsContentModel,
  NewsContentService,
  TokenInfoModel,
} from 'ntk-cms-api';
import { PublicHelper } from '../../../../core/helpers/services/publicHelper';
import { CmsToastrService } from '../../../../core/helpers/services/cmsToastr.service';
import { MatDialog } from '@angular/material/dialog';
import { NewsContentAddComponent } from '../add/add.component';
import { ProgressSpinnerModel } from '../../../../core/models/progressSpinnerModel';
import { ComponentOptionTreeModel } from 'src/app/core/cmsComponentModels/base/componentOptionTreeModel';
import { ComponentOptionSearchModel } from 'src/app/core/cmsComponentModels/base/componentOptionSearchModel';
import { ComponentOptionStatistModel } from 'src/app/core/cmsComponentModels/base/componentOptionStatistModel';
import { ComponentOptionExportModel } from 'src/app/core/cmsComponentModels/base/componentOptionExportModel';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';



@Component({
  selector: 'app-news-content-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class NewsContentListComponent implements OnInit {

  constructor(
    private coreAuthService: CoreAuthService,
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
  filteModelContent = new FilterModel();
  dataModelResult: ErrorExceptionResult<NewsContentModel> = new ErrorExceptionResult<NewsContentModel>();
  optionsCategoryTree: ComponentOptionTreeModel<NewsCategoryModel> = new ComponentOptionTreeModel<NewsCategoryModel>();
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  optionsExport: ComponentOptionExportModel = new ComponentOptionExportModel();

  tableRowsSelected: Array<NewsContentModel> = [];
  tableRowSelected: NewsContentModel = new NewsContentModel();
  // dateObject: any;
  loading = new ProgressSpinnerModel();
  tokenInfo = new TokenInfoModel();

  TabledisplayedColumns: string[] = [
    'LinkMainImageIdSrc',
    'Id',
    'RecordStatus',
    'Title',
    'CreatedDate',
    'UpdatedDate',
    'Action'
  ];

  // @ViewChild(MatPaginator, { static: true }) tablePaginator: MatPaginator;
  // @ViewChild(MatSort, { static: true }) tableSort: MatSort;



  tablePageEvent: PageEvent;
  tablePageIndex: number;
  // tablePageSize: number;
  tableLength: number;

  lastSort: MatSort
  onTableSortData(sort: MatSort): void {
    if (this.lastSort && this.lastSort.active === sort.active) {
      if (sort.start === 'desc') {
        sort.start = 'asc';
      } else {
        sort.start = 'desc';
      }
    }
    this.lastSort = sort;
    this.filteModelContent.SortColumn = sort.active;
    this.filteModelContent.SortType = EnumSortType.Ascending;
    if (sort.start === 'desc') {
      this.filteModelContent.SortType = EnumSortType.Descending;
    }
    this.DataGetAll();
  }
  public onTablePageingData(event?: PageEvent): void {
    this.filteModelContent.CurrentPageNumber = event.pageIndex + 1;
    this.filteModelContent.RowPerPage = event.pageSize;
    this.DataGetAll();
    // this.fooService.getdata(event).subscribe(
    //   response =>{
    //     if(response.error) {
    //       // handle error
    //     } else {
    //       this.datasource = response.data;
    //       this.pageIndex = response.pageIndex;
    //       this.pageSize = response.pageSize;
    //       this.length = response.length;
    //     }
    //   },
    //   error =>{
    //     // handle error
    //   }
    // );
    //return event;
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

    this.loading.display = true;
    this.loading.Globally = false;
    this.filteModelContent.AccessLoad = true;
    this.newsContentService.ServiceGetAll(this.filteModelContent).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelResult = next;
          if (this.tokenInfo.UserAccessAdminAllowToAllData) {
            this.TabledisplayedColumns = this.publicHelper.listAddIfNotExist(
              this.TabledisplayedColumns,
              'LinkSiteId',
              0
            );
          } else {
            this.TabledisplayedColumns = this.publicHelper.listRemoveIfExist(
              this.TabledisplayedColumns,
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
    this.router.navigate(['/news/content/add', this.optionsCategoryTree.data.Select.Id]);
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


    // this.router.navigate(['edit'], {
    //   relativeTo: this.activatedRoute,
    //   queryParams: { id: this.tableRowSelected.Id },
    // });
    this.router.navigate(['/news/content/edit', this.tableRowSelected.Id]);

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
    this.router.navigate(['/news/comment/', id]);
  }
}
