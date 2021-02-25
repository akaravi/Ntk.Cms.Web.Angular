import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import {
  MatTreeNestedDataSource,
} from '@angular/material/tree';
import {
  CoreAuthService,
  CoreEnumService,
  ErrorExceptionResult,
  FilterModel,
  TicketingDepartemenModel,
  TicketingDepartemenService,
  ntkCmsApiStoreService,
} from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TicketingDepartemenDeleteComponent } from '../delete/delete.component';
import { MatDialog } from '@angular/material/dialog';
import { TicketingDepartemenEditComponent } from '../edit/edit.component';
import { TicketingDepartemenAddComponent } from '../add/add.component';


@Component({
  selector: 'app-ticketing-departemen-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class TicketingDepartemenTreeComponent implements OnInit {
  constructor(
    private cmsApiStore : ntkCmsApiStoreService,
    private cmsToastrService: CmsToastrService,
    public coreEnumService: CoreEnumService,
    public categoryService: TicketingDepartemenService,
    private router: Router,
    public dialog: MatDialog
  ) {
  }
  dataModelSelect: TicketingDepartemenModel = new TicketingDepartemenModel();
  dataModelResult: ErrorExceptionResult<TicketingDepartemenModel> = new ErrorExceptionResult<TicketingDepartemenModel>();
  filteModel = new FilterModel();
  loading = new ProgressSpinnerModel();
  treeControl = new NestedTreeControl<TicketingDepartemenModel>(node => null);
  dataSource = new MatTreeNestedDataSource<TicketingDepartemenModel>();
  @Output() optionSelect = new EventEmitter();
  @Input() optionReload = () => this.onActionReload();
  @Input() set optionSelectForce(x: number | TicketingDepartemenModel) {
    this.onActionSelectForce(x);
  }

  hasChild = (_: number, node: TicketingDepartemenModel) => false;


  ngOnInit(): void {
    this.DataGetAll();
     this.cmsApiStoreSubscribe =  this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe(() => {
      this.DataGetAll();
    });
  }
  cmsApiStoreSubscribe:Subscription;
  ngOnDestroy() {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
    this.filteModel.RowPerPage = 200;
    this.filteModel.AccessLoad = true;
    this.loading.Globally = false;
    this.loading.display = true;
    this.categoryService.ServiceGetAll(this.filteModel).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelResult = next;
          this.dataSource.data = this.dataModelResult.ListItems;
        }
        this.loading.display = false;

      },
      (error) => {
        this.loading.display = false;

        this.cmsToastrService.typeError(error);

      }
    );
  }
  onActionSelect(model: TicketingDepartemenModel): void {
    this.dataModelSelect = model;
    this.optionSelect.emit(this.dataModelSelect);
  }
  onActionReload(): void {
    if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
      this.onActionSelect(this.dataModelSelect);
    }
    else {
      this.onActionSelect(null);
    }
    this.dataModelSelect = new TicketingDepartemenModel();
    this.DataGetAll();
  }
  onActionSelectForce(id: number | TicketingDepartemenModel): void {

  }

  onActionAdd(): void {
    const dialogRef = this.dialog.open(TicketingDepartemenAddComponent, {
      data: {  }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionEdit(): void {
    let id = 0;
    if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
      id = this.dataModelSelect.Id;
    }
    if (id === 0) {
      const title = 'برروز خطا ';
      const message = 'دسته بندی انتخاب نشده است';
      this.cmsToastrService.toastr.error(message, title);
      return;
    }
    const dialogRef = this.dialog.open(TicketingDepartemenEditComponent, {
      data: { id: id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionDelete(): void {

    let id = 0;
    if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
      id = this.dataModelSelect.Id;
    }
    if (id === 0) {
      const title = 'برروز خطا ';
      const message = 'دسته بندی انتخاب نشده است';
      this.cmsToastrService.toastr.error(message, title);
      return;
    }
    const dialogRef = this.dialog.open(TicketingDepartemenDeleteComponent, {
      data: { id: id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }
}
