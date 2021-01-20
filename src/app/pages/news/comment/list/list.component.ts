import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CoreAuthService,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  NewsCategoryModel,
  NewsCommentModel,
  NewsCommentService,
  TokenInfoModel,
} from 'ntk-cms-api';
import { PublicHelper } from '../../../../_helpers/services/publicHelper';
import { ComponentModalDataModel } from 'src/app/core/cmsComponentModels/base/componentModalDataModel';
import { CmsToastrService } from '../../../../_helpers/services/cmsToastr.service';
import { MatDialog } from '@angular/material/dialog';
import { ProgressSpinnerModel } from '../../../../core/models/progressSpinnerModel';
import { ComponentOptionSearchModel } from 'src/app/core/cmsComponentModels/base/componentOptionSearchModel';
import { ComponentOptionStatistModel } from 'src/app/core/cmsComponentModels/base/componentOptionStatistModel';
import { ComponentOptionExportModel } from 'src/app/core/cmsComponentModels/base/componentOptionExportModel';


@Component({
  selector: 'app-news-comment-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class NewsCommentListComponent implements OnInit {
  filteModelComment = new FilterModel();
  dataModelResult: ErrorExceptionResult<NewsCommentModel> = new ErrorExceptionResult<NewsCommentModel>();
  modalModel: ComponentModalDataModel = new ComponentModalDataModel();
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  optionsExport: ComponentOptionExportModel = new ComponentOptionExportModel();
  tableCommentloading = false;
  tableRowsSelected: Array<NewsCommentModel> = [];
  tableRowSelected: NewsCommentModel = new NewsCommentModel();
  // dateObject: any;
  loading = new ProgressSpinnerModel();
  tokenInfo = new TokenInfoModel();

  displayedColumns: string[] = [
    'RecordStatus',
    'Writer',
    'CreatedDate',
    'UpdatedDate',
    'Action'
  ];
  // dataSource: any;
  parentId = 0;
  constructor(
    private coreAuthService: CoreAuthService,
    private activatedRoute: ActivatedRoute,
    public publicHelper: PublicHelper,
    private newsCommentService: NewsCommentService,
    private toastrService: CmsToastrService,
    private router: Router,
    public dialog: MatDialog
  ) {


    this.optionsSearch.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionsSearch(model),
    };
  }

  ngOnInit(): void {
    this.parentId = Number(this.activatedRoute.snapshot.paramMap.get('parentId'));
    this.coreAuthService.CurrentTokenInfoBSObs.subscribe((next) => {
      this.DataGetAll();
      this.tokenInfo = next;
    });
  }

  DataGetAll(): void {
    if (this.parentId > 0) {
      const aaa = {
        PropertyName: 'LinkContentId',
        IntValue1: this.parentId,
      };
      this.filteModelComment.Filters.push(aaa as FilterDataModel);
    }
    this.tableRowsSelected = [];
    this.tableRowSelected = new NewsCommentModel();
    this.tableCommentloading = true;
    this.loading.display = true;
    this.loading.Globally = false;
    this.filteModelComment.AccessLoad = true;
    this.newsCommentService.ServiceGetAll(this.filteModelComment).subscribe(
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
        this.tableCommentloading = false;
        this.loading.display = false;
      },
      (error) => {
        this.toastrService.typeError(error);
        this.tableCommentloading = false;
        this.loading.display = false;
      }
    );
  }


  onActionbuttonNewRow(): void {

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
      queryParams: { parentId: this.parentId },
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
    // const dialogRef = this.dialog.open(NewsCommentAddComponent);

    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }
  onActionbuttonStatist(): void {

    this.optionsStatist.childMethods.runStatist(this.filteModelComment.Filters);
  }
  onActionbuttonExport(): void {
    this.optionsExport.data.show = !this.optionsExport.data.show;
    this.optionsExport.childMethods.runExport(this.filteModelComment.Filters);
  }

  onActionbuttonReload(): void {
    this.DataGetAll();
  }
  onSubmitOptionsSearch(model: any): void {
    this.filteModelComment.Filters = model;
    this.DataGetAll();
  }
  onActionTableRowSelect(row: NewsCommentModel): void {
    this.tableRowSelected = row;
  }

  onActionBackToParent(): void {
    this.router.navigate(['news/content']);
  }
}
