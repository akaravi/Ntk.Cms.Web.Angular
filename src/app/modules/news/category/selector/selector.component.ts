import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import {
  CoreEnumService,
  EnumClauseType,
  EnumFilterDataModelSearchTypes,
  ErrorExceptionResult,
  FilterDataModel,
  FilterModel,
  NewsCategoryModel,
  NewsCategoryService
} from 'ntk-cms-api';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Output } from '@angular/core';


@Component({
  selector: 'app-news-category-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class NewsCategorySelectorComponent implements OnInit {

  // public optionsData: ComponentOptionSelectorModel<NewsCategoryModel> = new ComponentOptionSelectorModel<NewsCategoryModel>();
  // @Output()
  // // tslint:disable-next-line: max-line-length
  // tslint:disable-next-line: max-line-length
  // optionsChange: EventEmitter<ComponentOptionSelectorModel<NewsCategoryModel>> = new EventEmitter<ComponentOptionSelectorModel<NewsCategoryModel>>();
  // @Input() set options(model: ComponentOptionSelectorModel<NewsCategoryModel>) {
  //   if (!model) {
  //     model = new ComponentOptionSelectorModel<NewsCategoryModel>();
  //   }
  //   this.optionsData = model;
  //   this.optionsData.childMethods = {
  //     ActionReload: () => this.onActionReload(),
  //     ActionSelectForce: (id) => this.onActionSelectForce(id),
  //   };
  //   this.optionsChange.emit(model);
  // }
  // get options(): ComponentOptionSelectorModel<NewsCategoryModel> {
  //   this.optionsData.childMethods = {
  //     ActionReload: () => this.onActionReload(),
  //     ActionSelectForce: (id) => this.onActionSelectForce(id),
  //   };
  //   this.optionsChange.emit(this.optionsData);
  //   return this.optionsData;
  // }

  constructor(
    public coreEnumService: CoreEnumService,
    public categoryService: NewsCategoryService) {


  }
  dataModelResult: ErrorExceptionResult<NewsCategoryModel> = new ErrorExceptionResult<NewsCategoryModel>();
  dataModelSelect: NewsCategoryModel = new NewsCategoryModel();
  loading = new ProgressSpinnerModel();
  formControl = new FormControl();
  filteredOptions: Observable<NewsCategoryModel[]>;
  @Input() optionPlaceholder = new EventEmitter<string>();
  @Output() optionSelect = new EventEmitter();
  @Input() optionReload = () => this.onActionReload();
  @Input() set optionSelectForce(x: number | NewsCategoryModel) {
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

  displayFn(model?: NewsCategoryModel): string | undefined {
    return model ? model.Title : undefined;
  }
  displayOption(model?: NewsCategoryModel): string | undefined {
    return model ? model.Title : undefined;
  }
  DataGetAll(text: string | number | any): Observable<NewsCategoryModel[]> {
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
  onActionSelect(model: NewsCategoryModel): void {
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
  push(newvalue: NewsCategoryModel): Observable<NewsCategoryModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.Id === newvalue.Id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: number | NewsCategoryModel): void {
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
    if (typeof id === typeof NewsCategoryModel) {
      this.filteredOptions = this.push((id as NewsCategoryModel));
      this.dataModelSelect = (id as NewsCategoryModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }

  onActionReload(): void {
    // if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
    //   this.onActionSelect(null);
    // }
    this.dataModelSelect = new NewsCategoryModel();
    // this.optionsData.Select = new NewsCategoryModel();
    this.DataGetAll(null);
  }
}
