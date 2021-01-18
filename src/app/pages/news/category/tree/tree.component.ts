import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
import { ComponentOptionNewsCategoryModel } from 'src/app/core/cmsComponentModels/news/componentOptionNewsCategoryModel';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NewsCategoryEditComponent } from '../edit/edit.component';
import { NewsCategoryDeleteComponent } from '../delete/delete.component';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';

// interface ExampleFlatNode {
//   expandable: boolean;
//   name: string;
//   level: number;
//   id: number;
// }

@Component({
  selector: 'app-news-category-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class CategoryComponent implements OnInit {
  @Input()
  set options(modelInput: ComponentOptionNewsCategoryModel) {
    this.optionsData = modelInput;
  }
  get options(): ComponentOptionNewsCategoryModel {
    return this.optionsData;
  }
  private optionsData: ComponentOptionNewsCategoryModel;
  constructor(
    private coreAuthService: CoreAuthService,
    private activatedRoute: ActivatedRoute,
    private toastrService: CmsToastrService,
    public coreEnumService: CoreEnumService,
    public categoryService: NewsCategoryService,
    private fb: FormBuilder,
    public dialog: MatDialog,
  ) {
  }
  // get f(): any {
  //   return this.categoryForm.controls;
  // }


  dataModelSelect: NewsCategoryModel = new NewsCategoryModel();
  // @ViewChild('myModal') myModal;
  // action: any;
  // categoryForm: FormGroup;
  // dataModel: NewsCategoryModel = new NewsCategoryModel();
  // statusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  dataModelResult: ErrorExceptionResult<NewsCategoryModel> = new ErrorExceptionResult<NewsCategoryModel>();
  filteModel = new FilterModel();
  loading = new ProgressSpinnerModel();
  // formInfo: FormInfoModel = new FormInfoModel();
  treeControl = new NestedTreeControl<NewsCategoryModel>(node => node.Children);
  dataSource = new MatTreeNestedDataSource<NewsCategoryModel>();
  // private transformer = (node: NewsCategoryModel, level: number) => {
  //   return {
  //     expandable: !!node.Children && node.Children.length > 0,
  //     name: node.Title,
  //     level,
  //     id: node.Id,
  //     description: node.Description,
  //     recordStatus: node.RecordStatus,
  //   };
  // }
  // tslint:disable-next-line
  // treeControl = new FlatTreeControl<NewsCategoryModel>(
  //   (node) => node.LinkParentId,
  //   (node) => node.Children && node.Children.length > 0
  // );
  // // tslint:disable-next-line
  // treeFlattener = new MatTreeFlattener(
  //   this.transformer,
  //   (node) => node.level,
  //   (node) => node.expandable,
  //   (node) => node.Children
  // );
  // // tslint:disable-next-line
  // dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  hasChild = (_: number, node: NewsCategoryModel) => !!node.Children && node.Children.length > 0;


  ngOnInit(): void {
    if (this.optionsData) {
      this.optionsData.parentMethods = {
        ActionReload: () => this.onActionReload(),
        ActionSelectForce: (id) => this.onActionSelectForce(id),
      };
    }
    this.coreAuthService.CurrentTokenInfoBSObs.subscribe(() => {
      this.DataGetAll();
    });
    // this.initForm();
    // this.dataModelCategory = this.activatedRoute.snapshot.data.categoryList.ListItems;
    // this.dataSource.data = this.dataModelCategory;

    // }

    // this.getStatus();
  }
  DataGetAll(): void {
    this.filteModel.RowPerPage = 200;
    this.filteModel.AccessLoad = true;
    // this.loading.backdropEnabled = false;
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
      if (this.optionsData.childMethods && this.optionsData.childMethods.onActionSelect) {
        this.optionsData.childMethods.onActionSelect(this.dataModelSelect);
      }
    }
  }
  onActionReload(): void {
    if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
      this.onActionSelect(null);
    }
    this.dataModelSelect = new NewsCategoryModel();
    this.optionsData.data.Select = new NewsCategoryModel();
    this.DataGetAll();
  }
  onActionSelectForce(id: number): void {

  }

  // initForm(): void {
  //   this.categoryForm = this.fb.group({
  //     title: ['', Validators.compose([Validators.required])],
  //     status: ['', Validators.compose([Validators.required])],
  //     description: ['', Validators.compose([Validators.required])],
  //   });
  // }

  // getStatus(): void {
  //   this.coreEnumService.ServiceEnumRecordStatus().subscribe((res) => {
  //     this.statusResult = res;
  //   });
  // }


  // onFormSubmit(): void {
  //   if (this.categoryForm.valid) {
  //     if (this.action === 'add') {
  //       this.hasError = false;
  //       if (typeof this.getNodeOfId !== 'undefined') {
  //         this.dataModel.LinkParentId = this.getNodeOfId.id;
  //       }
  //       this.categoryService.ServiceAdd(this.dataModel).subscribe((res) => {
  //         if (res.IsSuccess) {
  //           // this.dataSource.data = this.dataModelCategory;
  //         }
  //       });
  //     } else {
  //       this.hasError = false;
  //       // if (this.parentId !== this.getNodeOfId.id) {
  //       //   this.dataModel.LinkParentId = this.parentId;
  //       // }
  //       this.dataModel.Id = this.getNodeOfId.id;
  //       this.categoryService.ServiceEdit(this.dataModel).subscribe((res) => {
  //         if (res.IsSuccess) {
  //           // this.dataSource.data = this.dataModelCategory;
  //         }
  //       });
  //     }
  //   }
  // }

  onActionAdd(): void {
    let parentId = 0;
    if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
      parentId = this.dataModelSelect.Id;
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { parentId }


    const dialogRef = this.dialog.open(NewsCategoryEditComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      this.DataGetAll();
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
      this.DataGetAll();
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
      this.DataGetAll();
    });
  }

}
