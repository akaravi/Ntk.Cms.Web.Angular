import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CoreAuthService,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  NewsCategoryModel,
  NewsContentModel,
  NewsContentService,
} from 'ntk-cms-api';
import { PublicHelper } from '../../../../_helpers/services/publicHelper';
import { QueryBuilderConfig } from 'angular2-query-builder';
import { ComponentOptionSearchContentModel } from 'src/app/core/cmsComponentModels/base/componentOptionSearchContentModel';
import { ComponentOptionNewsCategoryDataModel, ComponentOptionNewsCategoryModel } from 'src/app/core/cmsComponentModels/news/componentOptionNewsCategoryModel';
import { ComponentModalDataModel } from 'src/app/core/cmsComponentModels/base/componentModalDataModel';
import { CmsToastrService } from '../../../../_helpers/services/cmsToastr.service';
import { MatDialog } from '@angular/material/dialog';
import { NewsCategoryEditComponent } from '../../category/edit/edit.component';
import { NewsCategoryDeleteComponent } from '../../category/delete/delete.component';
import { NewsContentAddComponent } from '../add/add.component';
import {  ProgressSpinnerModel } from '../../../../core/models/progressSpinnerModel';


@Component({
  selector: 'app-news-content-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ContentComponent implements OnInit {
  filteModelContent = new FilterModel();
  filteModelCategory = new FilterModel();
  dataModelResult: ErrorExceptionResult<NewsContentModel> = new ErrorExceptionResult<NewsContentModel>();
  optionsCategorySelect: ComponentOptionNewsCategoryModel = new ComponentOptionNewsCategoryModel();
  modalModel: ComponentModalDataModel = new ComponentModalDataModel();
  optionsSearchContentList: ComponentOptionSearchContentModel = new ComponentOptionSearchContentModel();
  tableContentloading = false;
  tableRowsSelected: Array<NewsContentModel> = [];
  tableRowSelected: NewsContentModel = new NewsContentModel();
  // dateObject: any;
  loading = new ProgressSpinnerModel();

  query: any;
  checked = false;
  config: QueryBuilderConfig = {
    fields: {
      age: { name: 'Age', type: 'number' },
      gender: {
        name: 'Gender',
        type: 'category',
        options: [
          { name: 'Male', value: 'm' },
          { name: 'Female', value: 'f' },
        ],
      },
    },
  };
  displayedColumns: string[] = [
    'LinkSiteId',
    'RecordStatus',
    'Title',
    'CreatedDate',
    'UpdatedDate',
  ];
  // dataSource: any;

  constructor(
    private coreAuthService: CoreAuthService,
    private activatedRoute: ActivatedRoute,
    public publicHelper: PublicHelper,
    private newsContentService: NewsContentService,
    private toastrService: CmsToastrService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.optionsCategorySelect.onActions = {
      onActionSelect: (x) => this.onActionCategorySelect(x),
    };
    this.optionsSearchContentList.onActions = {
      onSubmit: (model) => this.onSubmitOptionsSearch(model),
    };
  }

  ngOnInit(): void {


    this.coreAuthService.CurrentTokenInfoBSObs.subscribe(() => {
      this.DataGetAll();
    });
  }

  changed(event): void {
    this.checked = event.checked;
  }

  // getContentListById(event): any {
  //   this.filteModelContent = new FilterModel();
  //   this.optionsCategorySelect.data = new ComponentOptionNewsCategoryDataModel();
  //   this.optionsCategorySelect.data.Select = event;

  //   if (event && event.id > 0) {
  //     this.optionsCategorySelect.data.SelectId = event.id;
  //     const aaa = {
  //       PropertyName: 'LinkCategoryId',
  //       IntValue1: event.id,
  //     };
  //     this.filteModelContent.Filters.push(aaa as FilterDataModel);
  //   } else {
  //     this.optionsCategorySelect.data.SelectId = 0;
  //     if (this.optionsCategorySelect.methods) {
  //       this.optionsCategorySelect.methods.ActionSelectForce(0);
  //     }
  //   }
  //   this.DataGetAll();

  //   // return this.newsContentService
  //   //   .ServiceGetAll(this.filteModelContent)
  //   //   .subscribe((res) => {
  //   //     if (res.IsSuccess) {
  //   //       this.dataSource = [];
  //   //       this.dataSource = res.ListItems;
  //   //     }
  //   //   });
  // }

  DataGetAll(): void {
    this.tableRowsSelected = [];
    this.tableRowSelected = new NewsContentModel();
    this.tableContentloading = true;
    this.loading.display = true;
    this.loading.Globally = false;
    this.filteModelContent.AccessLoad = true;
    this.newsContentService.ServiceGetAll(this.filteModelContent).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelResult = next;
          if (this.optionsSearchContentList.methods) {
            this.optionsSearchContentList.methods.setAccess(next.Access);
          }
        }
        this.tableContentloading = false;
        this.loading.display = false;
      },
      (error) => {
        this.toastrService.typeError(error);
        this.tableContentloading = false;
        this.loading.display = false;
      }
    );
  }

  onActionCategorySelect(model: NewsCategoryModel | null): void {
    this.filteModelContent = new FilterModel();

    if (model && model.Id > 0) {
      const aaa = {
        PropertyName: 'LinkCategoryId',
        IntValue1: model.Id,
      };
      this.filteModelContent.Filters.push(aaa as FilterDataModel);
    } else {
      this.optionsCategorySelect.methods.ActionSelectForce(0);
    }
    this.DataGetAll();
  }


  onActionbuttonNewRow(): void {
    if (
      this.optionsCategorySelect == null ||
      this.optionsCategorySelect.data == null ||
      this.optionsCategorySelect.data.Select == null ||
      this.optionsCategorySelect.data.Select.Id === 0
    ) {
      const title = 'برروز خطا ';
      const message = 'دسته بندی انتخاب نشده است';
      this.toastrService.toastr.error(message, title);
      return;
    }
    if (
      this.dataModelResult == null ||
      this.dataModelResult.Access == null ||
      !this.dataModelResult.Access.AccessAddRow
    ) {
      const title = 'برروز خطا ';
      const message = 'شما دسترسی برای اضافه کردن ندارید';
      this.toastrService.toastr.error(message, title);
      return;
    }
    const modalModel: ComponentModalDataModel = {
      Title: 'محتوای جدید',
      SwitchValue: 'contentContentAdd',
    };
    this.router.navigate(['add'], {
      relativeTo: this.activatedRoute,
      queryParams: { parentId: this.optionsCategorySelect.data.Select.Id },
    });
  }

  onActionbuttonEditRow(): void {
    if (
      this.tableRowSelected == null ||
      this.tableRowSelected.Id === 0
    ) {
      const title = 'برروز خطا ';
      const message = 'ردیفی برای ویرایش انتخاب نشده است';
      this.toastrService.toastr.error(message, title);
      return;
    }
    if (
      this.dataModelResult == null ||
      this.dataModelResult.Access == null ||
      !this.dataModelResult.Access.AccessEditRow
    ) {
      const title = 'برروز خطا ';
      const message = 'شما دسترسی برای ویرایش ندارید';
      this.toastrService.toastr.error(message, title);
      return;
    }

    this.router.navigate(['edit'], {
      relativeTo: this.activatedRoute,
      queryParams: { id: this.tableRowSelected.Id },
    });
  }
  onActionbuttonDeleteRow(): void {
    if (
      this.tableRowSelected == null ||
      this.tableRowSelected.Id === 0
    ) {
      const title = 'برروز خطا ';
      const message = 'ردیفی برای ویرایش انتخاب نشده است';
      this.toastrService.toastr.error(message, title);
      return;
    }
    if (
      this.dataModelResult == null ||
      this.dataModelResult.Access == null ||
      !this.dataModelResult.Access.AccessDeleteRow
    ) {
      const title = 'برروز خطا ';
      const message = 'شما دسترسی برای حذف ندارید';
      this.toastrService.toastr.error(message, title);
      return;
    }
    const modalModel: ComponentModalDataModel = {
      Title: 'حذف محتوا',
      SwitchValue: 'contentContentDelete',
    };
    const dialogRef = this.dialog.open(NewsContentAddComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  onActionbuttonStatus(): void { }
  onActionbuttonExport(): void { }

  onActionbuttonReload(): void {
    this.DataGetAll();
  }
  onSubmitOptionsSearch(model: any): void {
    this.filteModelContent.Filters = model;
    this.DataGetAll();
  }
  onActionTableRowSelect(row: NewsContentModel): void {
    this.tableRowSelected = row;
  }

  onClickComment(id: number): void {
    this.router.navigate(['news/comment/', id]);
  }
}
