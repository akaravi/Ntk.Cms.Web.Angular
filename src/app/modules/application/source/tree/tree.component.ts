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
  ApplicationSourceModel,
  ApplicationSourceService,
  ntkCmsApiStoreService,
} from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Router } from '@angular/router';


@Component({
  selector: 'app-application-source-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class ApplicationSourceTreeComponent implements OnInit {
  constructor(
    private cmsApiStore : ntkCmsApiStoreService,
    private cmsToastrService: CmsToastrService,
    public coreEnumService: CoreEnumService,
    public categoryService: ApplicationSourceService,
    private router: Router,

  ) {
  }
  dataModelSelect: ApplicationSourceModel = new ApplicationSourceModel();
  dataModelResult: ErrorExceptionResult<ApplicationSourceModel> = new ErrorExceptionResult<ApplicationSourceModel>();
  filteModel = new FilterModel();
  loading = new ProgressSpinnerModel();
  treeControl = new NestedTreeControl<ApplicationSourceModel>(node => null);
  dataSource = new MatTreeNestedDataSource<ApplicationSourceModel>();
  @Output() optionSelect = new EventEmitter();
  @Input() optionReload = () => this.onActionReload();
  @Input() set optionSelectForce(x: number | ApplicationSourceModel) {
    this.onActionSelectForce(x);
  }

  hasChild = (_: number, node: ApplicationSourceModel) => false;


  ngOnInit(): void {
    this.DataGetAll();
     this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe(() => {
      this.DataGetAll();
    });
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
  onActionSelect(model: ApplicationSourceModel): void {
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
    this.dataModelSelect = new ApplicationSourceModel();
    this.DataGetAll();
  }
  onActionSelectForce(id: number | ApplicationSourceModel): void {

  }

  onActionAdd(): void {
    this.router.navigate(['/application/source/add']);

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
    this.router.navigate(['/application/source/edit/', id]);
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
    this.router.navigate(['/application/source/delete/', id]);

  }
}
