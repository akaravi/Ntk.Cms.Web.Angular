import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import {
  CoreEnumService,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  CoreUserModel,
  CoreUserService,
  EnumFilterDataModelSearchTypes,
  EnumClauseType
} from 'ntk-cms-api';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Output } from '@angular/core';


@Component({
  selector: 'app-core-user-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class CoreUserSelectorComponent implements OnInit {

  constructor(
    public coreEnumService: CoreEnumService,
    public categoryService: CoreUserService) {


  }
  dataModelResult: ErrorExceptionResult<CoreUserModel> = new ErrorExceptionResult<CoreUserModel>();
  dataModelSelect: CoreUserModel = new CoreUserModel();
  loading = new ProgressSpinnerModel();
  formControl = new FormControl();
  filteredOptions: Observable<CoreUserModel[]>;
  @Input() disabled = new EventEmitter<boolean>();
  @Input() optionPlaceholder = new EventEmitter<string>();
  @Output() optionSelect = new EventEmitter();
  @Input() optionReload = () => this.onActionReload();
  @Input() set optionSelectForce(x: number | CoreUserModel) {
    this.onActionSelectForce(x);
  }

  ngOnInit(): void {
    this.filteredOptions = this.formControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap(val => {
          if (typeof val === 'string' || typeof val === 'number') {
            return this.DataGetAll(val || '');
          }
          return [];
        }),
        // tap(() => this.myControl.setValue(this.options[0]))
      );
  }

  displayFn(model?: CoreUserModel): string | undefined {
    return model ? (model.Username + ' # ' + model.Name + ' # ' + model.LastName + ' # ' + model.Id) : undefined;
  }
  displayOption(model?: CoreUserModel): string | undefined {
    return model ? (model.Username + ' # ' + model.Name + ' # ' + model.LastName + ' # ' + model.Id) : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<CoreUserModel[]> {
    const filteModel = new FilterModel();
    filteModel.RowPerPage = 20;
    filteModel.AccessLoad = true;
    // this.loading.backdropEnabled = false;
    if (text && text.length > 0) {
      let filter = new FilterDataModel();
      /*Filters */
      filter = new FilterDataModel();
      filter.PropertyName = 'username';
      filter.Value = text;
      filter.SearchType = EnumFilterDataModelSearchTypes.Contains;
      filter.ClauseType = EnumClauseType.Or;
      filteModel.Filters.push(filter);
      /*Filters */
      /*Filters */
      filter = new FilterDataModel();
      filter.PropertyName = 'name';
      filter.Value = text;
      filter.SearchType = EnumFilterDataModelSearchTypes.Contains;
      filter.ClauseType = EnumClauseType.Or;
      filteModel.Filters.push(filter);
      /*Filters */
      filter = new FilterDataModel();
      filter.PropertyName = 'email';
      filter.Value = text;
      filter.SearchType = EnumFilterDataModelSearchTypes.Contains;
      filter.ClauseType = EnumClauseType.Or;
      filteModel.Filters.push(filter);
      /*Filters */
      filter = new FilterDataModel();
      filter.PropertyName = 'lastname';
      filter.Value = text;
      filter.SearchType = EnumFilterDataModelSearchTypes.Contains;
      filter.ClauseType = EnumClauseType.Or;
      filteModel.Filters.push(filter);

      if (text && typeof +text === 'number' && +text > 0) {
        /*Filters */
        filter = new FilterDataModel();
        filter.PropertyName = 'Id';
        filter.Value = text;
        filter.SearchType = EnumFilterDataModelSearchTypes.Equal;
        filter.ClauseType = EnumClauseType.Or;
        filteModel.Filters.push(filter);

      }
    }
    this.loading.Globally = false;
    this.loading.display = true;
    return await this.categoryService.ServiceGetAll(filteModel)
      .pipe(
        map(response => {
          return response.ListItems;
        })
      ).toPromise();
  }
  onActionSelect(model: CoreUserModel): void {
    this.dataModelSelect = model;
    this.optionSelect.emit(this.dataModelSelect);
  }
  onActionSelectClear(): void {
    this.formControl.setValue(null);
    this.optionSelect.emit(null);
  }

  push(newvalue: CoreUserModel): Observable<CoreUserModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.Id === newvalue.Id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: number | CoreUserModel): void {
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
    if (typeof id === typeof CoreUserModel) {
      this.filteredOptions = this.push((id as CoreUserModel));
      this.dataModelSelect = (id as CoreUserModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }

  onActionReload(): void {
    // if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
    //   this.onActionSelect(null);
    // }
    this.dataModelSelect = new CoreUserModel();
    // this.optionsData.Select = new CoreUserModel();
    this.DataGetAll(null);
  }
}
