import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { CoreEnumService, ErrorExceptionResult, FilterDataModel, FilterModel, CoreSiteModel, CoreSiteService, EnumFilterDataModelSearchTypes, EnumClauseType } from 'ntk-cms-api';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Output } from '@angular/core';


@Component({
  selector: 'app-core-site-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class CoreSiteSelectorComponent implements OnInit {

  constructor(
    public coreEnumService: CoreEnumService,
    public categoryService: CoreSiteService) {


  }
  dataModelResult: ErrorExceptionResult<CoreSiteModel> = new ErrorExceptionResult<CoreSiteModel>();
  dataModelSelect: CoreSiteModel = new CoreSiteModel();
  loading = new ProgressSpinnerModel();
  formControl = new FormControl();
  filteredOptions: Observable<CoreSiteModel[]>;
  @Input() disabled = new EventEmitter<boolean>();
  @Input() optionPlaceholder = new EventEmitter<string>();
  @Output() optionSelect = new EventEmitter();
  @Input() optionReload = () => this.onActionReload();
  @Input() set optionSelectForce(x: number | CoreSiteModel) {
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

  displayFn(model?: CoreSiteModel): string | undefined {
    return model ? (model.Title + ' # ' + model.Id) : undefined;
  }
  displayOption(model?: CoreSiteModel): string | undefined {
    return model ? (model.Title + ' # ' + model.Id) : undefined;
  }
  DataGetAll(text: string | number | any): Observable<CoreSiteModel[]> {
    const filteModel = new FilterModel();
    filteModel.RowPerPage = 20;
    filteModel.AccessLoad = true;
    // this.loading.backdropEnabled = false;
    if (!text || text.length === 0) {
      return;
    }
    let filter = new FilterDataModel();
    /*Filters */
    filter = new FilterDataModel();
    filter.PropertyName = 'SubDomain';
    filter.Value = text;
    filter.SearchType = EnumFilterDataModelSearchTypes.Contains;
    filter.ClauseType = EnumClauseType.Or;
    filteModel.Filters.push(filter);
    /*Filters */
    /*Filters */
    filter = new FilterDataModel();
    filter.PropertyName = 'Domain';
    filter.Value = text;
    filter.SearchType = EnumFilterDataModelSearchTypes.Contains;
    filter.ClauseType = EnumClauseType.Or;
    filteModel.Filters.push(filter);
    /*Filters */
    filter = new FilterDataModel();
    filter.PropertyName = 'Title';
    filter.Value = text;
    filter.SearchType = EnumFilterDataModelSearchTypes.Contains;
    filter.ClauseType = EnumClauseType.Or;
    filteModel.Filters.push(filter);

    if (text && typeof +text === 'number' && +text > 0){
      /*Filters */
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
  onActionSelect(model: CoreSiteModel): void {
    this.dataModelSelect = model;
    this.optionSelect.emit(this.dataModelSelect);
  }

  push(newvalue: CoreSiteModel): Observable<CoreSiteModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.Id === newvalue.Id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: number | CoreSiteModel): void {
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
    if (typeof id === typeof CoreSiteModel) {
      this.filteredOptions = this.push((id as CoreSiteModel));
      this.dataModelSelect = (id as CoreSiteModel);
      this.formControl.setValue(id);
      return;
    }
    this.formControl.setValue(null);
  }

  onActionReload(): void {
    // if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
    //   this.onActionSelect(null);
    // }
    this.dataModelSelect = new CoreSiteModel();
    // this.optionsData.Select = new CoreSiteModel();
    this.DataGetAll(null);
  }
}
