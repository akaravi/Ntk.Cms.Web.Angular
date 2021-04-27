
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {
  CoreModuleSaleItemModel,
  CoreModuleSaleSerialService,
  EnumSortType,
  ErrorExceptionResult,
  FilterModel,
  NtkCmsApiStoreService,
  TokenInfoModel,
  FilterDataModel,
  EnumRecordStatus,
  DataFieldInfoModel,
  CoreModuleSaleHeaderModel,
  CoreEnumService,
  EnumModel,
  CoreModuleService,
  CoreModuleModel,
  CoreModuleCheckSerialForSiteDtoModel,
  CoreModuleSaleSerialModel,
  CoreModuleSaleInvoiceDetailModel,
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
  selector: 'app-core-modulesaleserial-check-list',
  templateUrl: './check-list.component.html',
  styleUrls: ['./check-list.component.scss']
})
export class CoreModuleSaleSerialCheckListComponent implements OnInit, OnDestroy {
  requestSerial = '';
  constructor(
    private coreModuleSaleSerialService: CoreModuleSaleSerialService,
    private cmsApiStore: NtkCmsApiStoreService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    public coreEnumService: CoreEnumService,
    private activatedRoute: ActivatedRoute,
    private coreModuleService: CoreModuleService,
    private router: Router,
    public dialog: MatDialog) {
    this.requestSerial = this.activatedRoute.snapshot.paramMap.get('Serial');



  }
  comment: string;
  author: string;
  dataSource: any;
  flag = false;
  tableContentSelected = [];
  dataModel: CoreModuleCheckSerialForSiteDtoModel = new CoreModuleCheckSerialForSiteDtoModel();
  dataModelResult: ErrorExceptionResult<CoreModuleSaleInvoiceDetailModel> = new ErrorExceptionResult<CoreModuleSaleInvoiceDetailModel>();
  optionsSearch: ComponentOptionSearchModel = new ComponentOptionSearchModel();
  optionsStatist: ComponentOptionStatistModel = new ComponentOptionStatistModel();
  optionsExport: ComponentOptionExportModel = new ComponentOptionExportModel();
  tokenInfo = new TokenInfoModel();
  loading = new ProgressSpinnerModel();
  tableRowsSelected: Array<CoreModuleSaleInvoiceDetailModel> = [];
  tableRowSelected: CoreModuleSaleInvoiceDetailModel = new CoreModuleSaleInvoiceDetailModel();
  tableSource: MatTableDataSource<CoreModuleSaleInvoiceDetailModel> = new MatTableDataSource<CoreModuleSaleInvoiceDetailModel>();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  categoryModelSelected: CoreModuleSaleHeaderModel = new CoreModuleSaleHeaderModel();
  dataModelEnumCmsModuleSaleItemTypeResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  dataModelCoreModuleResult: ErrorExceptionResult<CoreModuleModel> = new ErrorExceptionResult<CoreModuleModel>();

  tabledisplayedColumns: string[] = [
    'LinkModuleId',
    'EnumCmsModuleSaleItemType',
    'FromDate',
    'ExpireDate',
  ];



  expandedElement: CoreModuleSaleItemModel | null;
  cmsApiStoreSubscribe: Subscription;

  ngOnInit(): void {
    if (this.requestSerial && this.requestSerial.length > 0) {
      this.DataGetAll(this.requestSerial);
    }
    this.tokenInfo = this.cmsApiStore.getStateSnapshot().ntkCmsAPiState.tokenInfo;
    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe((next) => {
      if (this.requestSerial && this.requestSerial.length > 0) {
        this.DataGetAll(this.requestSerial);
      }
      this.tokenInfo = next;
    });
    this.getEnumCmsModuleSaleItemType();

    this.getModuleList();
  }
  getModuleList(): void {
    const filter = new FilterModel();
    filter.RowPerPage = 100;
    this.coreModuleService.ServiceGetAll(filter).subscribe((next) => {
      this.dataModelCoreModuleResult = next;
    });
  }
  getEnumCmsModuleSaleItemType(): void {
    this.coreEnumService.ServiceEnumCmsModuleSaleItemType().subscribe((next) => {
      this.dataModelEnumCmsModuleSaleItemTypeResult = next;
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(serial: string): void {
    this.tableRowsSelected = [];
    this.tableRowSelected = new CoreModuleSaleInvoiceDetailModel();

    this.loading.display = true;
    this.loading.Globally = false;

    const model = new CoreModuleCheckSerialForSiteDtoModel();
    model.serialNumber = serial;

    this.coreModuleSaleSerialService.ServiceCheckUseSerialForSite(model).subscribe(
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



  onActionbuttonReload(): void {
    if (!this.dataModel || !this.dataModel.serialNumber || this.dataModel.serialNumber.length === 0) {
      const message = 'مقادیر به درستی  وارد نشده است';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.DataGetAll(this.dataModel.serialNumber);
  }

  onActionTableRowSelect(row: CoreModuleSaleInvoiceDetailModel): void {
    this.tableRowSelected = row;
  }
  onActionBackToParent(): void {
    this.router.navigate(['/core/modulesale/serial']);
  }
}
