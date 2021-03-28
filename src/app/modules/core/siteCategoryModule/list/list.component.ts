
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  CoreSiteCategoryCmsModuleModel,
  CoreSiteCategoryCmsModuleService,
  CoreAuthService,
  EnumSortType,
  ErrorExceptionResult,
  FilterModel,
  NtkCmsApiStoreService,
  TokenInfoModel,
  FilterDataModel,
  EnumRecordStatus
} from 'ntk-cms-api';
import { ComponentOptionSearchModel } from 'src/app/core/cmsComponentModels/base/componentOptionSearchModel';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { MatDialog } from '@angular/material/dialog';
import { ComponentOptionExportModel } from 'src/app/core/cmsComponentModels/base/componentOptionExportModel';
import { ComponentOptionStatistModel } from 'src/app/core/cmsComponentModels/base/componentOptionStatistModel';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { CoreSiteCategoryCmsModuleDeleteComponent } from '../delete/delete.component';


@Component({
  selector: 'app-core-sitecategorycmsmodule-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class CoreSiteCategoryCmsModuleListComponent implements OnInit , OnDestroy {
  constructor(private coreSiteCategoryCmsModuleService: CoreSiteCategoryCmsModuleService,
              private cmsApiStore: NtkCmsApiStoreService,
              public publicHelper: PublicHelper,
              private cmsToastrService: CmsToastrService,
              private router: Router,
              public dialog: MatDialog) {
    this.optionsSearch.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionsSearch(model),
    };
  }
  comment: string;
  author: string;
  dataSource: any;
  flag = false;
  tableContentSelected = [];

  filteModelContent = new FilterModel();
  dataModelResult: ErrorExceptionResult<CoreSiteCategoryCmsModuleModel> = new ErrorExceptionResult<CoreSiteCategoryCmsModuleModel>();
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  optionsExport: ComponentOptionExportModel = new ComponentOptionExportModel();
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<CoreSiteCategoryCmsModuleModel> = [];
  tableRowSelected: CoreSiteCategoryCmsModuleModel = new CoreSiteCategoryCmsModuleModel();
  tableSource: MatTableDataSource<CoreSiteCategoryCmsModuleModel> = new MatTableDataSource<CoreSiteCategoryCmsModuleModel>();


  tabledisplayedColumns: string[] = [
    'MainImageSrc',
    'Id',
    'linkCreatedBySiteCategoryCmsModuleId',
    'RecordStatus',
    'Title',
    'SubDomain',
    'Domain',
    'CreatedDate',
    'UpdatedDate',
    'Action'
  ];



  expandedElement: CoreSiteCategoryCmsModuleModel | null;
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.filteModelContent.SortColumn = 'Title';
    this.DataGetAll();
    this.tokenInfo = this.cmsApiStore.getStateSnapshot().ntkCmsAPiState.tokenInfo;
    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe((next) => {
      this.DataGetAll();
      this.tokenInfo = next;
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
    this.tableRowsSelected = [];
    this.tableRowSelected = new CoreSiteCategoryCmsModuleModel();

    this.loading.display = true;
    this.loading.Globally = false;
    this.filteModelContent.AccessLoad = true;

    this.coreSiteCategoryCmsModuleService.ServiceGetAll(this.filteModelContent).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelResult = next;
          this.tableSource.data = next.ListItems;
          if (this.tokenInfo.UserAccessAdminAllowToAllData) {
            this.tabledisplayedColumns = this.publicHelper.listAddIfNotExist(
              this.tabledisplayedColumns,
              'linkCreatedBySiteCategoryCmsModuleId',
              0
            );
          } else {
            this.tabledisplayedColumns = this.publicHelper.listRemoveIfExist(
              this.tabledisplayedColumns,
              'linkCreatedBySiteCategoryCmsModuleId'
            );
          }

          if (this.optionsSearch.childMethods) {
            this.optionsSearch.childMethods.setAccess(next.Access);
          }
        }
        this.loading.display = false;
      },
      (error) => {
        this.cmsToastrService.typeError(error);

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


  onActionbuttonNewRow(): void {

    if (
      this.dataModelResult == null ||
      this.dataModelResult.Access == null ||
      !this.dataModelResult.Access.AccessAddRow
    ) {
      this.cmsToastrService.typeErrorAccessAdd();
      return;
    }
    // const dialogRef = this.dialog.open(CoreSiteCategoryCmsModuleAddComponent, {
    //   data: {}
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result && result.dialogChangedDate) {
    //     this.DataGetAll();
    //   }
    // });
  }

  onActionbuttonEditRow(model: CoreSiteCategoryCmsModuleModel = this.tableRowSelected): void {

    if (!model || !model.Id || model.Id === 0) {
      const title = 'برروز خطا ';
      const message = 'ردیفی برای ویرایش انتخاب نشده است';
      this.cmsToastrService.toastr.error(message, title);
      return;
    }
    this.tableRowSelected = model;
    if (
      this.dataModelResult == null ||
      this.dataModelResult.Access == null ||
      !this.dataModelResult.Access.AccessEditRow
    ) {
      this.cmsToastrService.typeErrorAccessEdit();
      return;
    }
  //   const dialogRef = this.dialog.open(CoreSiteCategoryCmsModuleEditComponent, {
  //     data: { id: this.tableRowSelected.Id }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result && result.dialogChangedDate) {
  //       this.DataGetAll();
  //     }
  //   });
   }
  onActionbuttonDeleteRow(model: CoreSiteCategoryCmsModuleModel = this.tableRowSelected): void {
    if (!model || !model.Id || model.Id === 0) {
      const title = 'برروز خطا ';
      const message = 'ردیفی برای ویرایش انتخاب نشده است';
      this.cmsToastrService.toastr.error(message, title);
      return;
    }
    this.tableRowSelected = model;

    if (
      this.dataModelResult == null ||
      this.dataModelResult.Access == null ||
      !this.dataModelResult.Access.AccessDeleteRow
    ) {
      this.cmsToastrService.typeErrorAccessDelete();
      return;
    }
    const dialogRef = this.dialog.open(CoreSiteCategoryCmsModuleDeleteComponent, {
      data: { id: this.tableRowSelected.Id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });

  }

  onActionbuttonGoToSiteCategoryCmsModuleList(model: CoreSiteCategoryCmsModuleModel = this.tableRowSelected): void {
    if (!model || !model.Id || model.Id === 0) {
      const title = 'برروز خطا ';
      const message = 'ردیفی برای نمایش انتخاب نشده است';
      this.cmsToastrService.toastr.error(message, title);
      return;
    }
    this.tableRowSelected = model;

    this.router.navigate(['/core/siteSiteCategoryCmsModule/', this.tableRowSelected.Id]);
  }
   onActionbuttonStatist(): void {
    this.optionsStatist.data.show = !this.optionsStatist.data.show;
    if (!this.optionsStatist.data.show) {
      return;
    }
    const statist = new Map<string, number>();
    statist.set('Active', 0);
    statist.set('All', 0);
    this.coreSiteCategoryCmsModuleService.ServiceGetCount(this.filteModelContent).subscribe(
      (next) => {
        if (next.IsSuccess) {
          statist.set('All', next.TotalRowCount);
          this.optionsStatist.childMethods.runStatist(statist);
        }
      },
      (error) => {
        this.cmsToastrService.typeError(error);
      }
    );

    const filterStatist1 = this.filteModelContent;
    const fastFilter = new FilterDataModel();
    fastFilter.PropertyName = 'RecordStatus';
    fastFilter.Value = EnumRecordStatus.Available;
    filterStatist1.Filters.push(fastFilter);
    this.coreSiteCategoryCmsModuleService.ServiceGetCount(filterStatist1).subscribe(
      (next) => {
        if (next.IsSuccess) {
          statist.set('Active', next.TotalRowCount);
          this.optionsStatist.childMethods.runStatist(statist);
        }
      }
      ,
      (error) => {
        this.cmsToastrService.typeError(error);
      }
    );

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
  onActionTableRowSelect(row: CoreSiteCategoryCmsModuleModel): void {
    this.tableRowSelected = row;
  }

}
