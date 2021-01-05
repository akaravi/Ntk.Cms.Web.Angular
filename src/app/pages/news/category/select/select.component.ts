
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ITreeOptions, KEYS, TreeComponent, TreeNode, TREE_ACTIONS } from '@circlon/angular-tree-component';
import { ErrorExceptionResult, FilterModel, NewsCategoryModel, NewsCategoryService } from 'ntk-cms-api';
import { ActivatedRoute } from '@angular/router';
import { CmsToastrService } from 'src/app/_helpers/services/cmsToastr.service';
import { ComponentOptionNewsCategoryModel } from 'src/app/core/cmsComponentModels/news/componentOptionNewsCategoryModel';


@Component({
  selector: 'app-news-category-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class NewsCategorySelectComponent implements OnInit {
  @ViewChild('tree', { static: false }) tree: TreeComponent;

  @Input()
  set options(modelInput: ComponentOptionNewsCategoryModel) {
    this.optionsData = modelInput;
  }
  get options(): ComponentOptionNewsCategoryModel {
    return this.optionsData;
  }
  private optionsData: ComponentOptionNewsCategoryModel;
  loadingStatus = false; // add one more property


  filteModelCategory = new FilterModel();
  dataModelCategory: ErrorExceptionResult<NewsCategoryModel> = new ErrorExceptionResult<NewsCategoryModel>();

  optionsModelTree: ITreeOptions = {
    idField: 'id',
    displayField: 'Title',
    childrenField: 'Children',
    // hasChildrenField: 'Children',
    // isExpandedField: 'expanded',
    actionMapping: {
      mouse: {
        dblClick: (tree, node, $event) => {
          if (node.hasChildren) {
            TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
          }
        },
        click: (tree, node) => {
          this.onActionSelect(node.data);
        },
      },
      keys: {
        [KEYS.ENTER]: (tree, node) => {
          node.expandAll();
        },
      },
    },
    // nodeHeight: 23,
    allowDrag: () => {
      return false;
    },
    allowDrop: () => {
      return false;
    },
    allowDragoverStyling: true,
    levelPadding: 10,
    // useVirtualScroll: true,
    animateExpand: true,
    scrollOnActivate: true,
    animateSpeed: 30,
    animateAcceleration: 1.2,
    // scrollContainer: document.documentElement, // HTML
    rtl: true,
    nodeClass: (node: TreeNode) => {
      return 'icon-ntk-' + node.data.icon;
    }
  };
  constructor(
    private toastrService: CmsToastrService,
    public categoryService: NewsCategoryService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadingStatus = true;
    if (this.activatedRoute.snapshot.data.getCategory) {
      this.dataModelCategory = this.activatedRoute.snapshot.data.getCategory;
      this.loadingStatus = false;
    }
    // this.DataGetAllCategory();

    // this.optionsData.methods = { ActionReload: () => this.onActionReload() }
    this.optionsData.methods = {
      ActionReload: () => this.onActionReload(),
      ActionSelectForce: (id) => this.onActionSelectForce(id),
    };

  }
  DataGetAllCategory(): void {
    this.filteModelCategory.RowPerPage = 200;
    this.loadingStatus = true;
    this.categoryService.ServiceGetAll(this.filteModelCategory).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelCategory = next;
        }
        this.loadingStatus = false;
      },
      (error) => {
        this.toastrService.typeError(error);
        this.loadingStatus = false;
      }
    );
  }
  onActionSelect(model: NewsCategoryModel): void {
    debugger
    if (this.optionsData && this.optionsData.onActions && this.optionsData.onActions.onActionSelect) {
      this.optionsData.onActions.onActionSelect(model);
      this.optionsData.data.Select = model;
    }
  }
  onActionReload(): void {
    this.DataGetAllCategory();
  }
  onActionSelectForce(id: number): void {

  }
}
