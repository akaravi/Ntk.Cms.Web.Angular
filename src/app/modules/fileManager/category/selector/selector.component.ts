import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import {
  CoreEnumService,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  FileCategoryModel,
  FileCategoryService,
  EnumFilterDataModelSearchTypes,
  EnumClauseType
} from 'ntk-cms-api';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Output } from '@angular/core';


@Component({
  selector: 'app-file-category-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class FileCategorySelectorComponent implements OnInit {

  constructor(
    public coreEnumService: CoreEnumService,
    public categoryService: FileCategoryService) {


  }
  dataModelResult: ErrorExceptionResult<FileCategoryModel> = new ErrorExceptionResult<FileCategoryModel>();
  dataModelSelect: FileCategoryModel = new FileCategoryModel();
  loading = new ProgressSpinnerModel();
  formControl = new FormControl();
  filteredOptions: Observable<FileCategoryModel[]>;
  @Input() optionPlaceholder = new EventEmitter<string>();
  @Output() optionSelect = new EventEmitter();
  @Input() optionReload = () => this.onActionReload();
  @Input() set optionSelectForce(x: number | FileCategoryModel) {
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

  displayFn(model?: FileCategoryModel): string | undefined {
    return model ? model.Title : undefined;
  }
  displayOption(model?: FileCategoryModel): string | undefined {
    return model ? model.Title : undefined;
  }
  async DataGetAll(text: string | number | any): Promise<FileCategoryModel[]> {
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
    return await this.categoryService.ServiceGetAll(filteModel)
      .pipe(
        map(response => {
          return response.ListItems;
        })
      ).toPromise();
  }
  onActionSelect(model: FileCategoryModel): void {
    this.dataModelSelect = model;
    this.optionSelect.emit(this.dataModelSelect);
    // this.optionsData.Select = this.dataModelSelect;
    // if (this.optionsData) {
    //   this.optionsData.data.Select = this.dataModelSelect;
    //   if (this.optionsData.parentMethods && this.optionsData.parentMethods.onActionSelect) {
    //     this.optionsData.parentMethods.onActionSelect(this.dataModelSelect);
    //   }
    // }
  }
  onActionSelectClear(): void{
    this.formControl.setValue(null);
    this.optionSelect.emit(null);
  }
  push(newvalue: FileCategoryModel): Observable<FileCategoryModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.Id === newvalue.Id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: number | FileCategoryModel): void {
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
    if (typeof id === typeof FileCategoryModel) {
      this.filteredOptions = this.push((id as FileCategoryModel));
      this.dataModelSelect = (id as FileCategoryModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }

  onActionReload(): void {
    // if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
    //   this.onActionSelect(null);
    // }
    this.dataModelSelect = new FileCategoryModel();
    // this.optionsData.Select = new FileCategoryModel();
    this.DataGetAll(null);
  }
}
