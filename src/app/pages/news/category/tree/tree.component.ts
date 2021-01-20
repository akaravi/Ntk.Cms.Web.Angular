import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeNestedDataSource,
} from '@angular/material/tree';
import {
  CoreAuthService,
  CoreEnumService,
  EnumModel,
  ErrorExceptionResult,
  FilterModel,
  FormInfoModel,
  NewsCategoryModel,
  NewsCategoryService,
} from 'ntk-cms-api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CmsToastrService } from 'src/app/_helpers/services/cmsToastr.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NewsCategoryEditComponent } from '../edit/edit.component';
import { NewsCategoryDeleteComponent } from '../delete/delete.component';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { ComponentOptionTreeModel } from 'src/app/core/cmsComponentModels/base/componentOptionTreeModel';


@Component({
  selector: 'app-news-category-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class NewsCategoryTreeComponent implements OnInit {
  public optionsData: ComponentOptionTreeModel<NewsCategoryModel> = new ComponentOptionTreeModel<NewsCategoryModel>();
  @Output()
  // tslint:disable-next-line: max-line-length
  optionsChange: EventEmitter<ComponentOptionTreeModel<NewsCategoryModel>> = new EventEmitter<ComponentOptionTreeModel<NewsCategoryModel>>();
  @Input() set options(model: ComponentOptionTreeModel<NewsCategoryModel>) {
    if (!model) {
      model = new ComponentOptionTreeModel<NewsCategoryModel>();
    }
    this.optionsData = model;
    this.optionsData.childMethods = {
      ActionReload: () => this.onActionReload(),
      ActionSelectForce: (id) => this.onActionSelectForce(id),
    };
    this.optionsChange.emit(model);
  }
  get options(): ComponentOptionTreeModel<NewsCategoryModel> {
    return this.optionsData;
  }



  constructor(
    private coreAuthService: CoreAuthService,
    private toastrService: CmsToastrService,
    public coreEnumService: CoreEnumService,
    public categoryService: NewsCategoryService,
    public dialog: MatDialog,
  ) {
  }
  dataModelSelect: NewsCategoryModel = new NewsCategoryModel();
  dataModelResult: ErrorExceptionResult<NewsCategoryModel> = new ErrorExceptionResult<NewsCategoryModel>();
  filteModel = new FilterModel();
  loading = new ProgressSpinnerModel();
  // formInfo: FormInfoModel = new FormInfoModel();
  treeControl = new NestedTreeControl<NewsCategoryModel>(node => node.Children);
  dataSource = new MatTreeNestedDataSource<NewsCategoryModel>();

  hasChild = (_: number, node: NewsCategoryModel) => !!node.Children && node.Children.length > 0;


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

        this.toastrService.typeError(error);

      }
    );
  }
  onActionSelect(model: NewsCategoryModel): void {
    this.dataModelSelect = model;
    if (this.optionsData) {
      this.optionsData.data.Select = this.dataModelSelect;
      if (this.optionsData.parentMethods && this.optionsData.parentMethods.onActionSelect) {
        this.optionsData.parentMethods.onActionSelect(this.dataModelSelect);
      }
    }
  }
  onActionReload(): void {
    if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
      this.onActionSelect(this.dataModelSelect);
    }
    else {
      this.onActionSelect(null);
    }
    this.dataModelSelect = new NewsCategoryModel();
    this.optionsData.data.Select = new NewsCategoryModel();
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


    const dialogRef = this.dialog.open(NewsCategoryEditComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionEdit(): void {
    // this.dataModel.Title = this.getNodeOfId.name;
    // this.dataModel.Description = this.getNodeOfId.description;
    // this.dataModel.RecordStatus = this.getNodeOfId.recordStatus;
    // this.action = 'edit';
    let id = 0;
    if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
      id = this.dataModelSelect.Id;
    }
    if (id === 0) {
      const title = 'برروز خطا ';
      const message = 'دسته بندی انتخاب نشده است';
      this.toastrService.toastr.error(message, title);
      return;
    }
    const dialogRef = this.dialog.open(NewsCategoryEditComponent, {
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
      this.toastrService.toastr.error(message, title);
      return;
    }
    const dialogRef = this.dialog.open(NewsCategoryDeleteComponent, {
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
