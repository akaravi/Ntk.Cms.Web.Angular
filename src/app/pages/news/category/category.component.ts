import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {CoreEnumService, EnumModel, ErrorExceptionResult, FormInfoModel, NewsCategoryModel, NewsCategoryService} from 'ntk-cms-api';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ICategory} from './category.interface';
import {Observable} from 'rxjs';

interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  id: number;
}

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  @Output() contentList = new EventEmitter<any>();
  @ViewChild('myModal') myModal;
  action: any;
  categoryForm: FormGroup;
  dataModel: NewsCategoryModel = new NewsCategoryModel();
  statusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  TREE_DATA: ICategory[] = [];
  hasError: boolean;
  isLoading$: Observable<boolean>;
  getNodeOfId: any;
  flag = false;
  parentId: number;
  formInfo: FormInfoModel = new FormInfoModel();
  private transformer = (node: ICategory, level: number) => {
    return {
      expandable: !!node.Children && node.Children.length > 0,
      name: node.Title,
      level,
      id: node.Id,
      description: node.Description,
      recordStatus: node.RecordStatus
    };
  }

  constructor(private activatedRoute: ActivatedRoute,
              public coreEnumService: CoreEnumService,
              public newsCategoryService: NewsCategoryService,
              private fb: FormBuilder) {
  }

  // tslint:disable-next-line
  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);
  // tslint:disable-next-line
  treeFlattener = new MatTreeFlattener(
    this.transformer, node => node.level, node => node.expandable, node => node.Children);
  // tslint:disable-next-line
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  ngOnInit(): void {
    this.initForm();
    this.TREE_DATA = this.activatedRoute.snapshot.data.categoryList.ListItems;
    this.dataSource.data = this.TREE_DATA;
    this.getStatus();
  }

  get f(): any {
    return this.categoryForm.controls;
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      title: [
        '',
        Validators.compose([
          Validators.required
        ]),
      ],
      status: [
        '',
        Validators.compose([
          Validators.required,
        ]),
      ],
      description: [
        '',
        Validators.compose([
          Validators.required,
        ]),
      ],
    });
  }

  getStatus(): void {
    this.coreEnumService.ServiceEnumRecordStatus().subscribe((res) => {
      this.statusResult = res;
    });
  }

  getNode(node): void {
    this.contentList.emit(node);
    if (typeof this.parentId === 'undefined' || this.parentId !== node.id) {
      this.parentId = node.id;
    }
    this.getNodeOfId = node;
    this.flag = true;
  }

  onFormSubmit(): void {
    if (this.categoryForm.valid) {
      if (this.action === 'add') {
        this.hasError = false;
        if (typeof this.getNodeOfId !== 'undefined') {
          this.dataModel.LinkParentId = this.getNodeOfId.id;
        }
        this.newsCategoryService
          .ServiceAdd(this.dataModel)
          .subscribe((res) => {
            if (res.IsSuccess) {
              this.dataSource.data = this.TREE_DATA;
            }
          });
      } else {
        this.hasError = false;
        if (this.parentId !== this.getNodeOfId.id) {
          this.dataModel.LinkParentId = this.parentId;
        }
        this.dataModel.Id = this.getNodeOfId.id;
        this.newsCategoryService
          .ServiceEdit(this.dataModel)
          .subscribe((res) => {
            if (res.IsSuccess) {
              this.dataSource.data = this.TREE_DATA;
            }
          });
      }
    }
  }

  addNodeOfTreeNode(): void {
    this.dataModel = new NewsCategoryModel();
    this.action = 'add';
  }

  updateNodeOfTreeNode(): void {
    this.dataModel.Title = this.getNodeOfId.name;
    this.dataModel.Description = this.getNodeOfId.description;
    this.dataModel.RecordStatus = this.getNodeOfId.recordStatus;
    this.action = 'edit';
  }

  removeNodeOfTreeList(): void {
    this.newsCategoryService.ServiceDelete(this.getNodeOfId.id).subscribe((res) => {
      if (res.IsSuccess) {
      }
    });
  }
}
