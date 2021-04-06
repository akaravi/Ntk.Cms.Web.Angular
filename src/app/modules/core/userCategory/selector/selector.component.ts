import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import {
  CoreEnumService,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  CoreUserGroupModel,
  CoreUserGroupService,
  EnumFilterDataModelSearchTypes,
  EnumClauseType
} from 'ntk-cms-api';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Output } from '@angular/core';


@Component({
  selector: 'app-core-usercategory-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class CoreUserGroupSelectorComponent implements OnInit {

  constructor(
    public coreEnumService: CoreEnumService,
    public categoryService: CoreUserGroupService) {
  }
  dataModelResult: ErrorExceptionResult<CoreUserGroupModel> = new ErrorExceptionResult<CoreUserGroupModel>();
  dataModelSelect: CoreUserGroupModel = new CoreUserGroupModel();
  loading = new ProgressSpinnerModel();
  formControl = new FormControl();
  filteredOptions: Observable<CoreUserGroupModel[]>;
  @Input() disabled = new EventEmitter<boolean>();
  @Input() optionPlaceholder = new EventEmitter<string>();
  @Output() optionSelect = new EventEmitter();
  @Input() optionReload = () => this.onActionReload();
  @Input() set optionSelectForce(x: number | CoreUserGroupModel) {
    this.onActionSelectForce(x);
  }

  ngOnInit(): void {
    this.filteredOptions = this.formControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap(val => {
          if (typeof val === 'string') {
            return this.DataGetAll(val || '');
          }
        }),
        // tap(() => this.myControl.setValue(this.options[0]))
      );
  }

  displayFn(model?: CoreUserGroupModel): string | undefined {
    return model ? (model.Title + ' # ' + model.Id) : undefined;
  }
  displayOption(model?: CoreUserGroupModel): string | undefined {
    return model ? (model.Title + ' # ' + model.Id) : undefined;
  }
  DataGetAll(text: string | number | any): Observable<CoreUserGroupModel[]> {
    const filteModel = new FilterModel();
    filteModel.RowPerPage = 20;
    filteModel.AccessLoad = true;
    // this.loading.backdropEnabled = false;
    if (text && typeof text === 'string' && text.length > 0) {
      const filter = new FilterDataModel();
      filter.PropertyName = 'Title';
      filter.Value = text;
      filter.SearchType = EnumFilterDataModelSearchTypes.Contains;
      filteModel.Filters.push(filter);
    } else if (text && typeof +text === 'number' && +text > 0) {
      let filter = new FilterDataModel();
      filter.PropertyName = 'Title';
      filter.Value = text;
      filter.SearchType = EnumFilterDataModelSearchTypes.Contains;
      filter.ClauseType = EnumClauseType.Or;
      filteModel.Filters.push(filter);
      filter = new FilterDataModel();
      filter.PropertyName = 'Id';
      filter.Value = text;
      filter.SearchType = EnumFilterDataModelSearchTypes.Equal;
      filter.ClauseType = EnumClauseType.Or;
      filteModel.Filters.push(filter);
    }
    this.loading.Globally = false;
    this.loading.display = true;
    return this.categoryService.ServiceGetAll(filteModel)
      .pipe(
        map(response => {
          this.dataModelResult = response;
          return response.ListItems;
        }));
  }
  onActionSelect(model: CoreUserGroupModel): void {
    this.dataModelSelect = model;
    this.optionSelect.emit(this.dataModelSelect);
  }

  push(newvalue: CoreUserGroupModel): Observable<CoreUserGroupModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.Id === newvalue.Id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: number | CoreUserGroupModel): void {
    if (typeof id === 'number' && id > 0) {
      this.categoryService.ServiceGetOneById(id).subscribe((next) => {
        if (next.IsSuccess) {
          this.filteredOptions = this.push(next.Item);
          this.dataModelSelect = next.Item;
          this.formControl.setValue(next.Item);
        }
      });
      return;
    }
    if (typeof id === typeof CoreUserGroupModel) {
      this.filteredOptions = this.push((id as CoreUserGroupModel));
      this.dataModelSelect = (id as CoreUserGroupModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }

  onActionReload(): void {
    // if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
    //   this.onActionSelect(null);
    // }
    this.dataModelSelect = new CoreUserGroupModel();
    // this.optionsData.Select = new CoreUserGroupModel();
    this.DataGetAll(null);
  }
}
