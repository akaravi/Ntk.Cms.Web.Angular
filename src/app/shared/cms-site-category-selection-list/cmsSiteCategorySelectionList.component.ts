import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { CoreEnumService, ErrorExceptionResult, FilterModel, CoreSiteCategoryModel, CoreSiteCategoryService } from 'ntk-cms-api';
import { FormControl } from '@angular/forms';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Output } from '@angular/core';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';


@Component({
  selector: 'app-cms-sitecategory-selectionlist',
  templateUrl: './cmsSiteCategorySelectionList.component.html',
  styleUrls: ['./cmsSiteCategorySelectionList.component.scss']
})
export class CmsSiteCategorySelectionListComponent implements OnInit {

  constructor(
    public coreEnumService: CoreEnumService,
    public categoryService: CoreSiteCategoryService,
    private cmsToastrService: CmsToastrService) {
  }
  dataModelResult: ErrorExceptionResult<CoreSiteCategoryModel> = new ErrorExceptionResult<CoreSiteCategoryModel>();
  dataModelSelect: CoreSiteCategoryModel[] = [];
  dataIdsSelect: number[] = [];
  loading = new ProgressSpinnerModel();
  formControl = new FormControl();
  fieldsStatus: Map<number, boolean> = new Map<number, boolean>();

  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionPlaceholder = new EventEmitter<number>();
  @Output() optionSelect = new EventEmitter<CoreSiteCategoryModel[]>();
  @Output() optionSelectAdded = new EventEmitter();
  @Output() optionSelectRemoved = new EventEmitter();
  @Input() optionReload = () => this.onActionReload();
  @Input() set optionSelectForce(x: number[] | CoreSiteCategoryModel[]) {
    this.onActionSelectForce(x);
  }

  ngOnInit(): void {
    this.DataGetAll();
  }

  DataGetAll(): void {
    const filteModel = new FilterModel();
    filteModel.RowPerPage = 50;
    filteModel.AccessLoad = true;
    // this.loading.backdropEnabled = false;

    this.loading.Globally = false;
    this.loading.display = true;
    this.categoryService.ServiceGetAll(filteModel).subscribe(
      (next) => {
        this.fieldsStatus = new Map<number, boolean>();
        if (next.IsSuccess) {
          this.dataModelResult = next;
          this.dataModelResult.ListItems.forEach((el) => this.fieldsStatus.set(el.Id, false));
          this.dataIdsSelect.forEach((el) => this.fieldsStatus.set(el, true));
          this.dataModelResult.ListItems.forEach((el) => {
            if (this.fieldsStatus.get(el.Id)) {
              this.dataModelSelect.push(el);
            }
          });

        }
        this.loading.display = false;
      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.display = false;
      }
    );
  }
  onActionSelect(value: CoreSiteCategoryModel): void {
    const item = this.dataModelSelect.filter((obj) => {
      return obj.Id === value.Id;
    }).shift();
    if (item) {
      this.fieldsStatus.set(value.Id, false);
      this.optionSelectRemoved.emit(value);
      this.dataModelSelect.splice(this.dataModelSelect.indexOf(value), 1);
    } else {
      this.fieldsStatus.set(value.Id, true);
      this.optionSelectAdded.emit(value);
      this.dataModelSelect.push(value);
    }
    this.optionSelect.emit(this.dataModelSelect);
  }


  onActionSelectForce(ids: number[] | CoreSiteCategoryModel[]): void {
    if (typeof ids === typeof Array(Number)) {
      ids.forEach(element => {
        this.dataIdsSelect.push(element);
      });
    } else if (typeof ids === typeof Array(CoreSiteCategoryModel)) {
      ids.forEach(element => {
        this.dataIdsSelect.push(element.Id);
      });
    }
    this.dataIdsSelect.forEach((el) => this.fieldsStatus[el] = true);
  }

  onActionReload(): void {
    // this.dataModelSelect = new CoreSiteCategoryModel();
    this.DataGetAll();
  }
}
