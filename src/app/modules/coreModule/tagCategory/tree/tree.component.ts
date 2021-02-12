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
  NewsCategoryModel,
  NewsCategoryService,
  ntkCmsApiStoreService,
} from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { TagCategoryEditComponent } from '../edit/edit.component';
import { TagCategoryDeleteComponent } from '../delete/delete.component';


@Component({
  selector: 'app-news-category-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class NewsCategoryTreeComponent implements OnInit {
  // public optionsData: ComponentOptionTreeModel<NewsCategoryModel> = new ComponentOptionTreeModel<NewsCategoryModel>();
  // @Output()
  // // tslint:disable-next-line: max-line-length
  // optionsChange: EventEmitter<ComponentOptionTreeModel<NewsCategoryModel>> = new EventEmitter<ComponentOptionTreeModel<NewsCategoryModel>>();
  // @Input() set options(model: ComponentOptionTreeModel<NewsCategoryModel>) {
  //   if (!model) {
  //     model = new ComponentOptionTreeModel<NewsCategoryModel>();
  //   }
  //   this.optionsData = model;
  //   this.optionsData.childMethods = {
  //     ActionReload: () => this.onActionReload(),
  //     ActionSelectForce: (id) => this.onActionSelectForce(),
  //   };
  //   this.optionsChange.emit(model);
  // }
  // get options(): ComponentOptionTreeModel<NewsCategoryModel> {
  //   return this.optionsData;
  // }

  constructor(
    private cmsApiStore : ntkCmsApiStoreService,
    private cmsToastrService: CmsToastrService,
    public coreEnumService: CoreEnumService,
    public categoryService: NewsCategoryService,
    public dialog: MatDialog,
  ) {
  }
  dataModelSelect: NewsCategoryModel = new NewsCategoryModel();
  dataModelResult: ErrorExceptionResult<NewsCategoryModel> = new ErrorExceptionResult<NewsCategoryModel>();
  filteModel = new FilterModel();
  loading = new ProgressSpinnerModel();
  treeControl = new NestedTreeControl<NewsCategoryModel>(node => node.Children);
  dataSource = new MatTreeNestedDataSource<NewsCategoryModel>();
  @Output() optionSelect = new EventEmitter();
  @Input() optionReload = () => this.onActionReload();
  @Input() set optionSelectForce(x: number | NewsCategoryModel) {
    this.onActionSelectForce(x);
  }

  hasChild = (_: number, node: NewsCategoryModel) => !!node.Children && node.Children.length > 0;


  ngOnInit(): void {
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
  onActionSelect(model: NewsCategoryModel): void {
    this.dataModelSelect = model;
    this.optionSelect.emit(this.dataModelSelect);
    // if (this.optionsData) {
    //   this.optionsData.data.Select = this.dataModelSelect;
    //   if (this.optionsData.parentMethods && this.optionsData.parentMethods.onActionSelect) {
    //     this.optionsData.parentMethods.onActionSelect(this.dataModelSelect);
    //   }
    // }
  }
  onActionReload(): void {
    if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
      this.onActionSelect(this.dataModelSelect);
    }
    else {
      this.onActionSelect(null);
    }
    this.dataModelSelect = new NewsCategoryModel();
    // this.optionsData.data.Select = new NewsCategoryModel();
    this.DataGetAll();
  }
  onActionSelectForce(id: number | NewsCategoryModel): void {

  }

  onActionAdd(): void {
    let parentId = 0;
    if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
      parentId = this.dataModelSelect.Id;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { parentId };


    const dialogRef = this.dialog.open(TagCategoryEditComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
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
    const dialogRef = this.dialog.open(TagCategoryEditComponent, {
      data: { id }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionDelete(): void {
    // this.categoryService.ServiceDelete(this.getNodeOfId.id).subscribe((res) => {
    //   if (res.IsSuccess) {
    //   }
    // });
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
    const dialogRef = this.dialog.open(TagCategoryDeleteComponent, {
      data: { id }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

}
