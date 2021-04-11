import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  ApplicationThemeConfigModel,
  ApplicationAppService,
  ApplicationSourceModel,
  ApplicationThemeConfigService,
  CoreAuthService,
  EnumSortType,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  TokenInfoModel,
  NtkCmsApiStoreService,
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

@Component({
  selector: 'app-application-app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ApplicationThemeConfigListComponent implements OnInit, OnDestroy {
  constructor(
    private applicationThemeConfigService: ApplicationThemeConfigService,
    private activatedRoute: ActivatedRoute,
    private cmsApiStore: NtkCmsApiStoreService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    public dialog: MatDialog) {
    this.optionsSearch.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionsSearch(model),
    };
  }
  requestSourceId = 0;
  comment: string;
  author: string;
  dataSource: any;
  flag = false;
  tableContentSelected = [];

  filteModelContent = new FilterModel();
  dataModelResult: ErrorExceptionResult<ApplicationThemeConfigModel> = new ErrorExceptionResult<ApplicationThemeConfigModel>();
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  optionsExport: ComponentOptionExportModel = new ComponentOptionExportModel();
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<ApplicationThemeConfigModel> = [];
  tableRowSelected: ApplicationThemeConfigModel = new ApplicationThemeConfigModel();
  tableSource: MatTableDataSource<ApplicationThemeConfigModel> = new MatTableDataSource<ApplicationThemeConfigModel>();
  categoryModelSelected: ApplicationSourceModel;

  tabledisplayedColumns: string[] = [
    'LinkMainImageIdSrc',
    'Id',
    'RecordStatus',
    'Title',
    'LinkSourceId',
    'TypeId',
    'CreatedDate',
    'UpdatedDate',
    'Action'
  ];

  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  expandedElement: ApplicationThemeConfigModel | null;
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    this.requestSourceId = + Number(this.activatedRoute.snapshot.paramMap.get('SourceId'));
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
    this.tableRowSelected = new ApplicationThemeConfigModel();

    this.loading.display = true;
    this.loading.Globally = false;
    this.filteModelContent.AccessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/
    const filter = new FilterDataModel();
    if (this.requestSourceId > 0) {
      filter.PropertyName = 'LinkSourceId';
      filter.Value = this.requestSourceId;
      filterModel.Filters.push(filter);
    }
    if (this.categoryModelSelected && this.categoryModelSelected.Id > 0) {

      filter.PropertyName = 'LinkSourceId';
      filter.Value = this.requestSourceId;
      filterModel.Filters.push(filter);
    }
    this.applicationThemeConfigService.ServiceGetAll(filterModel).subscribe(
      (next) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);


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
          if (this.requestSourceId === 0) {
            this.tabledisplayedColumns = this.publicHelper.listRemoveIfExist(
              this.tabledisplayedColumns,
              'LinkSourceId'
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
      this.requestSourceId == null ||
      this.requestSourceId === 0
    ) {
      const message = 'محتوا انتخاب نشده است';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    if (
      this.dataModelResult == null ||
      this.dataModelResult.Access == null ||
      !this.dataModelResult.Access.AccessAddRow
    ) {
      this.cmsToastrService.typeErrorAccessAdd();
      return;
    }
    // const dialogRef = this.dialog.open(NewsCommentEditComponent, {
    //   data: { contentId: this.requestContentId }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   // console.log(`Dialog result: ${result}`);
    //   if (result && result.dialogChangedDate) {
    //     this.DataGetAll();
    //   }
    // });
  }

  onActionSelectorSelect(model: ApplicationSourceModel | null): void {
    this.filteModelContent = new FilterModel();
    this.categoryModelSelected = model;

    this.DataGetAll();
  }
  onActionbuttonEditRow(model: ApplicationThemeConfigModel = this.tableRowSelected): void {
    if (!model || !model.Id || model.Id === 0) {
      this.cmsToastrService.typeErrorSelected('ردیفی برای ویرایش انتخاب نشده است');
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

    // const dialogRef = this.dialog.open(NewsCommentEditComponent, {
    //   data: { id: this.tableRowSelected.Id }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   // console.log(`Dialog result: ${result}`);
    //   if (result && result.dialogChangedDate) {
    //     this.DataGetAll();
    //   }
    // });
  }
  onActionbuttonDeleteRow(model: ApplicationThemeConfigModel = this.tableRowSelected): void {
    if (!model || !model.Id || model.Id === 0) {
      const emessage = 'ردیفی برای حذف انتخاب نشده است';
      this.cmsToastrService.typeErrorSelected(emessage);
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
    // const dialogRef = this.dialog.open(NewsCommentDeleteComponent, {
    //   data: { id: this.tableRowSelected.Id }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   // console.log(`Dialog result: ${result}`);
    //   if (result && result.dialogChangedDate) {
    //     this.DataGetAll();
    //   }
    // });
  }
  onActionbuttonStatist(): void {
    this.optionsStatist.data.show = !this.optionsStatist.data.show;
    if (!this.optionsStatist.data.show) {
      return;
    }
    const statist = new Map<string, number>();
    statist.set('Active', 0);
    statist.set('All', 0);
    this.applicationThemeConfigService.ServiceGetCount(this.filteModelContent).subscribe(
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

    const filterStatist1 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter = new FilterDataModel();
    fastfilter.PropertyName = 'RecordStatus';
    fastfilter.Value = EnumRecordStatus.Available;
    filterStatist1.Filters.push(fastfilter);
    this.applicationThemeConfigService.ServiceGetCount(filterStatist1).subscribe(
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
  onActionTableRowSelect(row: ApplicationThemeConfigModel): void {
    this.tableRowSelected = row;
  }
  onActionBackToParent(): void {
    this.router.navigate(['/news/content/']);
  }
}
