import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { CoreEnumService, ErrorExceptionResult, FilterDataModel, FilterModel, BiographyCategoryModel, BiographyCategoryService } from 'ntk-cms-api';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Output } from '@angular/core';


@Component({
  selector: 'app-biography-category-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class BiographyCategorySelectorComponent implements OnInit {

  // public optionsData: ComponentOptionSelectorModel<BiographyCategoryModel> = new ComponentOptionSelectorModel<BiographyCategoryModel>();
  // @Output()
  // // tslint:disable-next-line: max-line-length
  // tslint:disable-next-line: max-line-length
  // optionsChange: EventEmitter<ComponentOptionSelectorModel<BiographyCategoryModel>> = new EventEmitter<ComponentOptionSelectorModel<BiographyCategoryModel>>();
  // @Input() set options(model: ComponentOptionSelectorModel<BiographyCategoryModel>) {
  //   if (!model) {
  //     model = new ComponentOptionSelectorModel<BiographyCategoryModel>();
  //   }
  //   this.optionsData = model;
  //   this.optionsData.childMethods = {
  //     ActionReload: () => this.onActionReload(),
  //     ActionSelectForce: (id) => this.onActionSelectForce(id),
  //   };
  //   this.optionsChange.emit(model);
  // }
  // get options(): ComponentOptionSelectorModel<BiographyCategoryModel> {
  //   this.optionsData.childMethods = {
  //     ActionReload: () => this.onActionReload(),
  //     ActionSelectForce: (id) => this.onActionSelectForce(id),
  //   };
  //   this.optionsChange.emit(this.optionsData);
  //   return this.optionsData;
  // }

  constructor(
    public coreEnumService: CoreEnumService,
    public categoryService: BiographyCategoryService) {


  }
  dataModelResult: ErrorExceptionResult<BiographyCategoryModel> = new ErrorExceptionResult<BiographyCategoryModel>();
  dataModelSelect: BiographyCategoryModel = new BiographyCategoryModel();
  loading = new ProgressSpinnerModel();
  formControl = new FormControl();
  filteredOptions: Observable<BiographyCategoryModel[]>;
  @Input() optionPlaceholder = new EventEmitter<string>();
  @Output() optionSelect = new EventEmitter();
  @Input() optionReload = () => this.onActionReload();
  @Input() set optionSelectForce(x: number | BiographyCategoryModel) {
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

  displayFn(user?: BiographyCategoryModel): string | undefined {
    return user ? user.Title : undefined;
  }
  DataGetAll(text: string | number | any): Observable<BiographyCategoryModel[]> {
    const filteModel = new FilterModel();
    filteModel.RowPerPage = 20;
    filteModel.AccessLoad = true;
    // this.loading.backdropEnabled = false;
    if (text && typeof text === 'string' && text.length > 0) {
      const aaa = {
        PropertyName: 'Title',
        Value: text,
        SearchType: 5
      };
      filteModel.Filters.push(aaa as FilterDataModel);
    } else if (text && typeof text === 'number' && text > 0) {
      const aaa = {
        PropertyName: 'Title',
        Value: text,
        SearchType: 5,
        ClauseType: 1
      };
      filteModel.Filters.push(aaa as FilterDataModel);
      const nnn = {
        PropertyName: 'Id',
        Value: text,
        SearchType: 1,
        ClauseType: 1
      };
      filteModel.Filters.push(nnn as FilterDataModel);
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
  onActionSelect(model: BiographyCategoryModel): void {
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

  push(newvalue: BiographyCategoryModel): Observable<BiographyCategoryModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.Id === newvalue.Id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: number | BiographyCategoryModel): void {
    if (typeof id === 'number' && id > 0) {
      this.categoryService.ServiceGetOneById(id).subscribe((next) => {
        if (next.IsSuccess) {
          this.filteredOptions = this.push(next.Item);
          this.dataModelSelect = next.Item;
          this.formControl.setValue(next.Item);
        }
      });
    }
    if (typeof id === typeof BiographyCategoryModel) {
      this.filteredOptions = this.push((id as BiographyCategoryModel));
      this.dataModelSelect = (id as BiographyCategoryModel);
      this.formControl.setValue(id);
    }
  }

  onActionReload(): void {
    // if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
    //   this.onActionSelect(null);
    // }
    this.dataModelSelect = new BiographyCategoryModel();
    // this.optionsData.Select = new BiographyCategoryModel();
    this.DataGetAll(null);
  }
}
