import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { CoreEnumService, ErrorExceptionResult, FilterDataModel, FilterModel, CoreUserGroupModel, CoreUserGroupService } from 'ntk-cms-api';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Output } from '@angular/core';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';


@Component({
  selector: 'app-core-usercategory-checklist',
  templateUrl: './checklist.component.html',
  styleUrls: ['./checklist.component.scss']
})
export class CoreUserGroupChecklistComponent implements OnInit {

  constructor(
    public coreEnumService: CoreEnumService,
    public categoryService: CoreUserGroupService,
    private cmsToastrService: CmsToastrService) {
  }
  dataModelResult: ErrorExceptionResult<CoreUserGroupModel> = new ErrorExceptionResult<CoreUserGroupModel>();
  dataModelSelect: CoreUserGroupModel[] = [];
  dataIdsSelect: number[] = [];
  loading = new ProgressSpinnerModel();
  formControl = new FormControl();
  fieldsStatus: Map<number, boolean> = new Map<number, boolean>();

    @Input() disabled = new EventEmitter<boolean>();
  public optionSelectFirstItem = true;
  @Input() optionPlaceholder = new EventEmitter<string>();
  @Output() optionSelect = new EventEmitter();
  @Output() optionSelectAdded = new EventEmitter();
  @Output() optionSelectRemoved = new EventEmitter();
  @Input() optionReload = () => this.onActionReload();
  @Input() set optionSelectForce(x: number[] | CoreUserGroupModel[]) {
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
  onActionSelect(value: CoreUserGroupModel): void {
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


  onActionSelectForce(ids: number[] | CoreUserGroupModel[]): void {
    if (typeof ids === typeof Array(Number)) {
      ids.forEach(element => {
        this.dataIdsSelect.push(element);
      });
    } else if (typeof ids === typeof Array(CoreUserGroupModel)) {
      ids.forEach(element => {
        this.dataIdsSelect.push(element.Id);
      });
    }
    this.dataIdsSelect.forEach((el) => this.fieldsStatus[el] = true);
  }

  onActionReload(): void {
    // this.dataModelSelect = new CoreUserGroupModel();
    this.DataGetAll();
  }
}
