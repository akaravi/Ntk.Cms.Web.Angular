import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  BankPaymentPrivateSiteConfigModel,
  ApplicationSourceModel,
  BankPaymentPrivateSiteConfigService,
  EnumSortType,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  TokenInfoModel,
  NtkCmsApiStoreService,
  EnumRecordStatus,
  DataFieldInfoModel,
  CoreCpMainMenuService,
  CoreCurrencyService,
  CoreCurrencyModel
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
import { BankPaymentPrivateSiteConfigAddComponent } from '../add/add.component';
import { BankPaymentPrivateSiteConfigEditComponent } from '../edit/edit.component';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { BankPaymentPrivateSiteConfigPaymentTestComponent } from '../paymentTest/paymentTest.component';

@Component({
  selector: 'app-bankpayment-privateconfig-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class BankPaymentPrivateSiteConfigListComponent implements OnInit, OnDestroy {
  requestLinkPublicConfigId = 0;
  constructor(
    private bankPaymentPrivateSiteConfigService: BankPaymentPrivateSiteConfigService,
    private activatedRoute: ActivatedRoute,
    private cmsApiStore: NtkCmsApiStoreService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    private cmsConfirmationDialogService: CmsConfirmationDialogService,
    private router: Router,
    public dialog: MatDialog) {
    this.optionsSearch.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionsSearch(model),
    };
    this.optionsExport.parentMethods = {
      onSubmit: (model) => this.onSubmitOptionExport(model),
    };
    /*filter Sort*/
    this.filteModelContent.SortColumn = 'Id';
    this.filteModelContent.SortType = EnumSortType.Descending;
  }
  comment: string;
  author: string;
  dataSource: any;
  flag = false;
  tableContentSelected = [];
  filteModelContent = new FilterModel();
  dataModelResult: ErrorExceptionResult<BankPaymentPrivateSiteConfigModel> = new ErrorExceptionResult<BankPaymentPrivateSiteConfigModel>();
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  optionsExport: ComponentOptionExportModel = new ComponentOptionExportModel();
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<BankPaymentPrivateSiteConfigModel> = [];
  tableRowSelected: BankPaymentPrivateSiteConfigModel = new BankPaymentPrivateSiteConfigModel();
  tableSource: MatTableDataSource<BankPaymentPrivateSiteConfigModel> = new MatTableDataSource<BankPaymentPrivateSiteConfigModel>();
  categoryModelSelected: ApplicationSourceModel;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  expandedElement: BankPaymentPrivateSiteConfigModel | null;
  cmsApiStoreSubscribe: Subscription;
  tabledisplayedColumns: string[] = [
    'LinkMainImageIdSrc',
    'Id',
    'RecordStatus',
    'Title',
    'LinkPublicConfigId',
    'MinTransactionAmount',
    'MaxTransactionAmount',
    'CreatedDate',
    'UpdatedDate',
    'Action'
  ];

  ngOnInit(): void {
    this.requestLinkPublicConfigId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkPublicConfigId'));
    const filter = new FilterDataModel();
    if (this.requestLinkPublicConfigId > 0) {
      filter.PropertyName = 'LinkPublicConfigId';
      filter.Value = this.requestLinkPublicConfigId;
      this.filteModelContent.Filters.push(filter);
    }
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
    this.tableRowSelected = new BankPaymentPrivateSiteConfigModel();

    this.loading.display = true;
    this.loading.Globally = false;
    this.filteModelContent.AccessLoad = true;
    /*filter CLone*/
    const filterModel = JSON.parse(JSON.stringify(this.filteModelContent));
    /*filter CLone*/
    const filter = new FilterDataModel();

    if (this.categoryModelSelected && this.categoryModelSelected.Id > 0) {
      filter.PropertyName = 'LinkPublicConfigId';
      filter.Value = this.categoryModelSelected.Id;
      filterModel.Filters.push(filter);
    }
    this.bankPaymentPrivateSiteConfigService.ServiceGetAll(filterModel).subscribe(
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
          if (this.requestLinkPublicConfigId === 0) {
            this.tabledisplayedColumns = this.publicHelper.listRemoveIfExist(
              this.tabledisplayedColumns,
              'LinkPublicConfigId'
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
    let ApplicationId = 0;
    if (this.requestLinkPublicConfigId > 0) {
      ApplicationId = this.requestLinkPublicConfigId;
    }
    if (this.categoryModelSelected && this.categoryModelSelected.Id && this.categoryModelSelected.Id > 0) {
      ApplicationId = this.categoryModelSelected.Id;
    }
    if (ApplicationId <= 0) {
      const message = 'سورسی انتخاب نشده است';
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
    const dialogRef = this.dialog.open(BankPaymentPrivateSiteConfigAddComponent, {
      data: { contentId: ApplicationId }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionSelectorSelect(model: ApplicationSourceModel | null): void {
    this.filteModelContent = new FilterModel();
    this.categoryModelSelected = model;

    this.DataGetAll();
  }
  onActionbuttonEditRow(model: BankPaymentPrivateSiteConfigModel = this.tableRowSelected): void {
    if (!model || !model.Id || model.Id === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
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

    const dialogRef = this.dialog.open(BankPaymentPrivateSiteConfigEditComponent, {
      data: { id: this.tableRowSelected.Id }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }
  onActionbuttonDeleteRow(model: BankPaymentPrivateSiteConfigModel = this.tableRowSelected): void {
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
    const title = 'لطفا تایید کنید...';
    const message = 'آیا مایل به حدف این محتوا می باشید ' + '?' + '<br> ( ' + this.tableRowSelected.Title + ' ) ';
    this.cmsConfirmationDialogService.confirm(title, message)
      .then((confirmed) => {
        if (confirmed) {
          this.loading.display = true;
          this.bankPaymentPrivateSiteConfigService.ServiceDelete(this.tableRowSelected.Id).subscribe(
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
  onActionbuttonStatist(): void {
    this.optionsStatist.data.show = !this.optionsStatist.data.show;
    if (!this.optionsStatist.data.show) {
      return;
    }
    const statist = new Map<string, number>();
    statist.set('Active', 0);
    statist.set('All', 0);
    this.bankPaymentPrivateSiteConfigService.ServiceGetCount(this.filteModelContent).subscribe(
      (next) => {
        if (next.IsSuccess) {
          statist.set('All', next.TotalRowCount);
          this.optionsStatist.childMethods.setStatistValue(statist);
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
    this.bankPaymentPrivateSiteConfigService.ServiceGetCount(filterStatist1).subscribe(
      (next) => {
        if (next.IsSuccess) {
          statist.set('Active', next.TotalRowCount);
          this.optionsStatist.childMethods.setStatistValue(statist);
        }
      }
      ,
      (error) => {
        this.cmsToastrService.typeError(error);
      }
    );

  }
  onActionbuttonTransactionList(model: BankPaymentPrivateSiteConfigModel = this.tableRowSelected): void {
    if (!model || !model.Id || model.Id === 0) {
      this.cmsToastrService.typeErrorSelectedRow();
      return;
    }
    this.tableRowSelected = model;

    this.router.navigate(['/bankpayment/transaction/LinkPrivateSiteConfigId', this.tableRowSelected.Id]);
  }
  onActionbuttonTestPayment(model: BankPaymentPrivateSiteConfigModel = this.tableRowSelected): void {
    if (!model || !model.Id || model.Id === 0) {

      const message = 'ردیفی انتخاب نشده است';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.tableRowSelected = model;

    if (
      this.dataModelResult == null ||
      this.dataModelResult.Access == null ||
      !this.dataModelResult.Access.AccessWatchRow
    ) {
      this.cmsToastrService.typeErrorSelected();
      return;
    }
    const dialogRef = this.dialog.open(BankPaymentPrivateSiteConfigPaymentTestComponent, {
      data: { LinkPrivateSiteConfigId: this.tableRowSelected.Id }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionbuttonExport(): void {
    this.optionsExport.data.show = !this.optionsExport.data.show;
    this.optionsExport.childMethods.setExportFilterModel(this.filteModelContent);
  }
  onSubmitOptionExport(model: FilterModel): void {
    const exportlist = new Map<string, string>();
    exportlist.set('Download', 'loading ... ');
    this.bankPaymentPrivateSiteConfigService.ServiceExportFile(model).subscribe(
      (next) => {
        if (next.IsSuccess) {
          exportlist.set('Download', next.LinkFile);
          this.optionsExport.childMethods.setExportLinkFile(exportlist);
        }
      },
      (error) => {
        this.cmsToastrService.typeError(error);
      }
    );
  }

  onActionbuttonReload(): void {
    this.DataGetAll();
  }
  onSubmitOptionsSearch(model: any): void {
    this.filteModelContent.Filters = model;
    this.DataGetAll();
  }
  onActionTableRowSelect(row: BankPaymentPrivateSiteConfigModel): void {
    this.tableRowSelected = row;
  }
  onActionBackToParent(): void {
    this.router.navigate(['/bankpayment/publicconfig/']);
  }
}
