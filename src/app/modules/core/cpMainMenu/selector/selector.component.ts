import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { CoreEnumService, ErrorExceptionResult, FilterDataModel, FilterModel, CoreCpMainMenuModel, CoreCpMainMenuService } from 'ntk-cms-api';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Output } from '@angular/core';


@Component({
  selector: 'app-core-cpmainmenu-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss']
})
export class CoreCpMainMenuSelectorComponent implements OnInit {

  constructor(
    public coreEnumService: CoreEnumService,
    public categoryService: CoreCpMainMenuService) {
  }
  dataModelResult: ErrorExceptionResult<CoreCpMainMenuModel> = new ErrorExceptionResult<CoreCpMainMenuModel>();
  dataModelSelect: CoreCpMainMenuModel = new CoreCpMainMenuModel();
  loading = new ProgressSpinnerModel();
  formControl = new FormControl();
  filteredOptions: Observable<CoreCpMainMenuModel[]>;
  @Input() disabled = new EventEmitter<boolean>();
  @Input() optionPlaceholder = new EventEmitter<string>();
  @Output() optionSelect = new EventEmitter();
  @Input() optionReload = () => this.onActionReload();
  @Input() set optionSelectForce(x: number | CoreCpMainMenuModel) {
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

  displayFn(user?: CoreCpMainMenuModel): string | undefined {
    return user ? (user.Title) : undefined;
  }
  DataGetAll(text: string | number | any): Observable<CoreCpMainMenuModel[]> {
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
  onActionSelect(model: CoreCpMainMenuModel): void {
    this.dataModelSelect = model;
    this.optionSelect.emit(this.dataModelSelect);
  }

  push(newvalue: CoreCpMainMenuModel): Observable<CoreCpMainMenuModel[]> {
    return this.filteredOptions.pipe(map(items => {
      if (items.find(x => x.Id === newvalue.Id)) {
        return items;
      }
      items.push(newvalue);
      return items;
    }));

  }
  onActionSelectForce(id: number | CoreCpMainMenuModel): void {
    if (typeof id === 'number' && id > 0) {
      this.categoryService.ServiceGetOneById(id).subscribe((next) => {
        if (next.IsSuccess) {
          this.filteredOptions = this.push(next.Item);
          this.dataModelSelect = next.Item;
          this.formControl.setValue(next.Item);
        }
      });
    }
    if (typeof id === typeof CoreCpMainMenuModel) {
      this.filteredOptions = this.push((id as CoreCpMainMenuModel));
      this.dataModelSelect = (id as CoreCpMainMenuModel);
      this.formControl.setValue(id);
    }
  }

  onActionReload(): void {
    // if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
    //   this.onActionSelect(null);
    // }
    this.dataModelSelect = new CoreCpMainMenuModel();
    // this.optionsData.Select = new CoreCpMainMenuModel();
    this.DataGetAll(null);
  }
}