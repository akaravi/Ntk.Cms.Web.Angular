
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {
  CoreCpMainMenuModel,
  CoreCpMainMenuService,
  CoreAuthService,
  EnumSortType,
  ErrorExceptionResult,
  FilterModel,
  NtkCmsApiStoreService,
  TokenInfoModel,
  FilterDataModel,
  EnumRecordStatus,
  DataFieldInfoModel
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
import { CoreCpMainMenuEditComponent } from '../edit/edit.component';
import { CoreCpMainMenuAddComponent } from '../add/add.component';
import { CmsConfirmationDialogService } from 'src/app/shared/cmsConfirmationDialog/cmsConfirmationDialog.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragHandle } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-core-user-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class CoreCpMainMenuListComponent implements OnInit, OnDestroy {
  constructor(
    private coreCpMainMenuService: CoreCpMainMenuService,
    private cmsConfirmationDialogService: CmsConfirmationDialogService,
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
  flag = false;
  tableContentSelected = [];

  filteModelContent = new FilterModel();
  dataModelResult: ErrorExceptionResult<CoreCpMainMenuModel> = new ErrorExceptionResult<CoreCpMainMenuModel>();
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  optionsExport: ComponentOptionExportModel = new ComponentOptionExportModel();
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<CoreCpMainMenuModel> = [];
  tableRowSelected: CoreCpMainMenuModel = new CoreCpMainMenuModel();
  tableSource: MatTableDataSource<CoreCpMainMenuModel> = new MatTableDataSource<CoreCpMainMenuModel>();


  tabledisplayedColumns: string[] = [
    'Icon',
    'Id',
    'RecordStatus',
    'Title',
    'TitleML',
    'ShowInAccessAdminAllowToProfessionalData',
    'MenuPlaceType',
    'ShowInMenuOrder',
    'Action',
    'position'
  ];

  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  columnsToDisplay: string[] = ['Id', 'Writer'];
  expandedElement: CoreCpMainMenuModel | null;
  cmsApiStoreSubscribe: Subscription;
  categoryModelSelected: CoreCpMainMenuModel;
  ngOnInit(): void {
    this.filteModelContent.SortColumn = 'ShowInMenuOrder';
    this.filteModelContent.SortType = EnumSortType.Ascending;
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

  dropTable(event: CdkDragDrop<CoreCpMainMenuModel[]>): void {
    debugger
    const previousIndex = this.tableSource.data.findIndex(row => row === event.item.data);
    moveItemInArray(this.tableSource.data, previousIndex, event.currentIndex);
    this.tableSource.data = this.tableSource.data.slice();
  }
  DataGetAll(): void {
    this.tableRowsSelected = [];
    this.tableRowSelected = new CoreCpMainMenuModel();

    this.loading.display = true;
    this.loading.Globally = false;
    this.filteModelContent.AccessLoad = true;
    if (this.categoryModelSelected && this.categoryModelSelected.Id > 0) {
      const filter = new FilterDataModel();
      filter.PropertyName = 'LinkParentId';
      filter.Value = this.categoryModelSelected.Id;
      this.filteModelContent.Filters.push(filter);
    }
    this.coreCpMainMenuService.ServiceGetAll(this.filteModelContent).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);

          this.dataModelResult = next;
          this.tableSource.data = next.ListItems;


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


  onActionCategorySelect(model: CoreCpMainMenuModel | null): void {
    this.filteModelContent = new FilterModel();
    this.categoryModelSelected = model;
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
    const dialogRef = this.dialog.open(CoreCpMainMenuAddComponent, {
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionbuttonEditRow(model: CoreCpMainMenuModel = this.tableRowSelected): void {

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
    const dialogRef = this.dialog.open(CoreCpMainMenuEditComponent, {
      data: { id: this.tableRowSelected.Id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionbuttonDeleteRow(mode: CoreCpMainMenuModel = this.tableRowSelected): void {
    if (mode == null || !mode.Id || mode.Id === 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      return;
    }
    this.tableRowSelected = mode;
    if (
      this.dataModelResult == null ||
      this.dataModelResult.Access == null ||
      !this.dataModelResult.Access.AccessDeleteRow
    ) {
      this.cmsToastrService.typeErrorAccessDelete();
      return;
    }
    const title = 'لطفا تایید کنید...';
    const message = 'آیا مایل به حدف این محتوا می باشید ' + '?' + '<br> ( ' + this.tableRowSelected.Title + ' ) ';
    this.cmsConfirmationDialogService.confirm(title, message)
      .then((confirmed) => {
        if (confirmed) {
          this.loading.display = true;
          this.coreCpMainMenuService.ServiceDelete(this.tableRowSelected.Id).subscribe(
            (next) => {
              if (next.IsSuccess) {
                this.cmsToastrService.typeSuccessRemove();
                this.DataGetAll();
              } else {
                this.cmsToastrService.typeErrorRemove();
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
      )
      .catch(() => {
        // console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)')
      }
      );
  }
  onActionbuttonFaqList(model: CoreCpMainMenuModel = this.tableRowSelected): void {
    if (!model || !model.Id || model.Id === 0) {
      const title = 'برروز خطا ';
      const message = 'ردیفی برای نمایش انتخاب نشده است';
      this.cmsToastrService.toastr.error(message, title);
      return;
    }
    this.tableRowSelected = model;

    this.router.navigate(['/core/faq/', this.tableRowSelected.Id]);
  }
  onActionbuttonTemplateList(model: CoreCpMainMenuModel = this.tableRowSelected): void {
    if (!model || !model.Id || model.Id === 0) {
      const title = 'برروز خطا ';
      const message = 'ردیفی برای نمایش انتخاب نشده است';
      this.cmsToastrService.toastr.error(message, title);
      return;
    }
    this.tableRowSelected = model;

    this.router.navigate(['/core/template/', this.tableRowSelected.Id]);
  }
  onActionbuttonGoToSiteList(model: CoreCpMainMenuModel = this.tableRowSelected): void {
    if (!model || !model.Id || model.Id === 0) {
      const title = 'برروز خطا ';
      const message = 'ردیفی برای نمایش انتخاب نشده است';
      this.cmsToastrService.toastr.error(message, title);
      return;
    }
    this.tableRowSelected = model;

    this.router.navigate(['/core/siteuser/', this.tableRowSelected.Id]);
  }
  onActionbuttonStatist(): void {
    this.optionsStatist.data.show = !this.optionsStatist.data.show;
    if (!this.optionsStatist.data.show) {
      return;
    }
    const statist = new Map<string, number>();
    statist.set('Active', 0);
    statist.set('All', 0);
    this.coreCpMainMenuService.ServiceGetCount(this.filteModelContent).subscribe(
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
    this.coreCpMainMenuService.ServiceGetCount(filterStatist1).subscribe(
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
    this.filteModelContent.SortColumn = 'ShowInMenuOrder';
    this.filteModelContent.SortType = EnumSortType.Ascending;
    this.DataGetAll();
  }
  onSubmitOptionsSearch(model: any): void {
    this.filteModelContent.Filters = model;
    this.DataGetAll();
  }
  onActionTableRowSelect(row: CoreCpMainMenuModel): void {
    this.tableRowSelected = row;
  }

}
