import { Component, OnInit, Input, ViewChild, EventEmitter } from '@angular/core';
import { ITreeOptions, KEYS, TreeComponent, TreeNode, TREE_ACTIONS } from '@circlon/angular-tree-component';
import { CoreAuthService, CoreEnumService, ErrorExceptionResult, FilterDataModel, FilterModel, NewsCategoryModel, NewsCategoryService } from 'ntk-cms-api';
import { ActivatedRoute } from '@angular/router';
import { CmsToastrService } from 'src/app/_helpers/services/cmsToastr.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, tap } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Output } from '@angular/core';
import { ComponentOptionSelectorModel } from 'src/app/core/cmsComponentModels/base/componentOptionSelectorModel';


@Component({
  selector: 'app-news-category-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css']
})
export class NewsCategorySelectorComponent implements OnInit {
  public optionsData: ComponentOptionSelectorModel<NewsCategoryModel> = new ComponentOptionSelectorModel<NewsCategoryModel>();
  @Output()
  // tslint:disable-next-line: max-line-length
  optionsChange: EventEmitter<ComponentOptionSelectorModel<NewsCategoryModel>> = new EventEmitter<ComponentOptionSelectorModel<NewsCategoryModel>>();
  @Input() set options(model: ComponentOptionSelectorModel<NewsCategoryModel>) {
    if (!model) {
      model = new ComponentOptionSelectorModel<NewsCategoryModel>();
    }
    this.optionsData = model;
    this.optionsData.childMethods = {
      ActionReload: () => this.onActionReload(),
      ActionSelectForce: (id) => this.onActionSelectForce(id),
    };
    this.optionsChange.emit(model);
  }
  get options(): ComponentOptionSelectorModel<NewsCategoryModel> {
    return this.optionsData;
  }



  dataModelResult: ErrorExceptionResult<NewsCategoryModel> = new ErrorExceptionResult<NewsCategoryModel>();
  dataModelSelect: NewsCategoryModel = new NewsCategoryModel();

  loading = new ProgressSpinnerModel();

  myControl = new FormControl();
  filteredOptions: Observable<NewsCategoryModel[] | void>;
  constructor(
    private coreAuthService: CoreAuthService,
    private toastrService: CmsToastrService,
    public coreEnumService: CoreEnumService,
    public categoryService: NewsCategoryService) { }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges
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

  displayFn(user?: NewsCategoryModel): string | undefined {
    return user ? user.Title : undefined;
  }
  DataGetAll(text: string | number | any): Observable<NewsCategoryModel[]> {
    const filteModel = new FilterModel();
    filteModel.RowPerPage = 200;
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
        SearchType: 5
      };
      filteModel.Filters.push(aaa as FilterDataModel);
      const nnn = {
        PropertyName: 'Id',
        Value: text,
        SearchType: 1
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
  onActionSelect(model: NewsCategoryModel): void {
    this.dataModelSelect = model;
    if (this.optionsData) {
      this.optionsData.data.Select = this.dataModelSelect;
      if (this.optionsData.parentMethods && this.optionsData.parentMethods.onActionSelect) {
        this.optionsData.parentMethods.onActionSelect(this.dataModelSelect);
      }
    }
  }
  onActionSelectForce(id: number | NewsCategoryModel): void {
    if (typeof id === 'number' && id > 0) {
      this.categoryService.ServiceGetOneById(id).subscribe((next) => {
        if (next.IsSuccess) {
          this.myControl.setValue(next.Item);
        }
      });
    }
    if (typeof id === typeof NewsCategoryModel && id > 0) {
      this.myControl.setValue(id);
    }
  }

  onActionReload(): void {
    // if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
    //   this.onActionSelect(null);
    // }
    this.dataModelSelect = new NewsCategoryModel();
    this.optionsData.data.Select = new NewsCategoryModel();
    this.DataGetAll(null);
  }
}
