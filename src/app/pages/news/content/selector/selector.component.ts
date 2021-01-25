import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { CoreEnumService, ErrorExceptionResult, FilterDataModel, FilterModel, NewsContentModel, NewsContentService } from 'ntk-cms-api';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Output } from '@angular/core';
import { ComponentOptionSelectorModel } from 'src/app/core/cmsComponentModels/base/componentOptionSelectorModel';


@Component({
  selector: 'app-news-content-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css']
})
export class NewsContentSelectorComponent implements OnInit {
  public optionsData: ComponentOptionSelectorModel<NewsContentModel> = new ComponentOptionSelectorModel<NewsContentModel>();
  @Output()
  // tslint:disable-next-line: max-line-length
  optionsChange: EventEmitter<ComponentOptionSelectorModel<NewsContentModel>> = new EventEmitter<ComponentOptionSelectorModel<NewsContentModel>>();
  @Input() set options(model: ComponentOptionSelectorModel<NewsContentModel>) {
    if (!model) {
      model = new ComponentOptionSelectorModel<NewsContentModel>();
    }
    this.optionsData = model;
    this.optionsData.childMethods = {
      ActionReload: () => this.onActionReload(),
      ActionSelectForce: (id) => this.onActionSelectForce(id),
    };
    this.optionsChange.emit(model);
  }
  get options(): ComponentOptionSelectorModel<NewsContentModel> {
    this.optionsData.childMethods = {
      ActionReload: () => this.onActionReload(),
      ActionSelectForce: (id) => this.onActionSelectForce(id),
    };
    return this.optionsData;
  }



  dataModelResult: ErrorExceptionResult<NewsContentModel> = new ErrorExceptionResult<NewsContentModel>();
  dataModelSelect: NewsContentModel = new NewsContentModel();

  loading = new ProgressSpinnerModel();

  formControl = new FormControl();
  filteredOptions: Observable<NewsContentModel[] >;
  constructor(
    public coreEnumService: CoreEnumService,
    public contentService: NewsContentService) {


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

  displayFn(user?: NewsContentModel): string | undefined {
    return user ? user.Title : undefined;
  }
  DataGetAll(text: string | number | any): Observable<NewsContentModel[]> {
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
    return this.contentService.ServiceGetAll(filteModel)
      .pipe(
        map(response => {
          this.dataModelResult = response;
          return response.ListItems;
        }));
  }
  onActionSelect(model: NewsContentModel): void {
    this.dataModelSelect = model;
    if (this.optionsData) {
      this.optionsData.data.Select = this.dataModelSelect;
      if (this.optionsData.parentMethods && this.optionsData.parentMethods.onActionSelect) {
        this.optionsData.parentMethods.onActionSelect(this.dataModelSelect);
      }
    }
  }

push(newvalue: NewsContentModel): Observable<NewsContentModel[]>
{
 return this.filteredOptions.pipe(map(items  => {
  if (items.find(x => x.Id === newvalue.Id)){
    return items;
  }
  items.push(newvalue);
  return items;
  }));

}
  onActionSelectForce(id: number | NewsContentModel): void {
    if (typeof id === 'number' && id > 0) {
      this.contentService.ServiceGetOneById(id).subscribe((next) => {
        if (next.IsSuccess) {
          this.filteredOptions = this.push(next.Item);
          this.dataModelSelect = next.Item;
          this.formControl.setValue(next.Item);
        }
      });
    }
    if (typeof id === typeof NewsContentModel) {
      this.filteredOptions = this.push( (id as NewsContentModel));
      this.dataModelSelect = (id as NewsContentModel);
      this.formControl.setValue( id );
    }
  }

  onActionReload(): void {
    // if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
    //   this.onActionSelect(null);
    // }
    this.dataModelSelect = new NewsContentModel();
    this.optionsData.data.Select = new NewsContentModel();
    this.DataGetAll(null);
  }
}
