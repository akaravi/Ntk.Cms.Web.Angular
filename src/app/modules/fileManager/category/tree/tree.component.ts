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
  FileCategoryModel,
  FileCategoryService,
} from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FileCategoryEditComponent } from '../edit/edit.component';
import { FileCategoryDeleteComponent } from '../delete/delete.component';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';


@Component({
  selector: 'app-file-category-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class FileCategoryTreeComponent implements OnInit {
  constructor(
    private coreAuthService: CoreAuthService,
    private cmsToastrService: CmsToastrService,
    public coreEnumService: CoreEnumService,
    public categoryService: FileCategoryService,
    public dialog: MatDialog,
  ) {
  }
  dataModelSelect: FileCategoryModel = new FileCategoryModel();
  dataModelResult: ErrorExceptionResult<FileCategoryModel> = new ErrorExceptionResult<FileCategoryModel>();
  filteModel = new FilterModel();
  loading = new ProgressSpinnerModel();
  treeControl = new NestedTreeControl<FileCategoryModel>(node => node.Children);
  dataSource = new MatTreeNestedDataSource<FileCategoryModel>();
  @Output() optionSelect = new EventEmitter();
  @Input() optionReload = () => this.onActionReload();
  @Input() set optionSelectForce(x: number | FileCategoryModel) {
    this.onActionSelectForce(x);
  }

  hasChild = (_: number, node: FileCategoryModel) => !!node.Children && node.Children.length > 0;


  ngOnInit(): void {
    this.coreAuthService.CurrentTokenInfoBSObs.subscribe(() => {
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
  onActionSelect(model: FileCategoryModel): void {
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
    this.dataModelSelect = new FileCategoryModel();
    // this.optionsData.data.Select = new FileCategoryModel();
    this.DataGetAll();
  }
  onActionSelectForce(id: number | FileCategoryModel): void {

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


    const dialogRef = this.dialog.open(FileCategoryEditComponent, dialogConfig);
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
    const dialogRef = this.dialog.open(FileCategoryEditComponent, {
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
    const dialogRef = this.dialog.open(FileCategoryDeleteComponent, {
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
