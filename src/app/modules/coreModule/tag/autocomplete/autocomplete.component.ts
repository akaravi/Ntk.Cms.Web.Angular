import { CmsToastrService } from 'src/app/core/helpers/services/cmsToastr.service';
import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { CoreModuleTagModel, CoreModuleTagService, ErrorExceptionResult, FilterDataModel, FilterModel } from 'ntk-cms-api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Output } from '@angular/core';




@Component({
  selector: 'app-tag-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class TagAutocompleteComponent implements OnInit {
  constructor(
    public coreModuleTagService: CoreModuleTagService,
    private toasterService: CmsToastrService) {


  }
  datatagDataModelResult: ErrorExceptionResult<CoreModuleTagModel> = new ErrorExceptionResult<CoreModuleTagModel>();
  tagDataModel = [];


  @Input() optionPlaceholder = new EventEmitter<string>();
  @Output() optionChange = new EventEmitter<number[]>();
  @Input() set optionSelectForce(x: number[]) {
    this.onActionSelectForce(x);
  }
  ngOnInit(): void {
  }

  public requestAutocompleteItems = (text: string): Observable<any> => {
    const filteModel = new FilterModel();
    filteModel.RowPerPage = 20;
    filteModel.AccessLoad = true;
    if (text && typeof text === 'string' && text.length > 0) {
      const aaa = {
        PropertyName: 'Title',
        Value: text,
        SearchType: 5
      };
      filteModel.Filters.push(aaa as FilterDataModel);
    } else if (text && typeof text === 'number' && text > 0) {
      const aaa2 = {
        PropertyName: 'Title',
        Value: text + '',
        SearchType: 5,
        ClauseType: 1
      };
      filteModel.Filters.push(aaa2 as FilterDataModel);
      const aaa3 = {
        PropertyName: 'Id',
        Value: text + '',
        SearchType: 1,
        ClauseType: 1
      };
      filteModel.Filters.push(aaa3 as FilterDataModel);
    }
    return this.coreModuleTagService.ServiceGetAll(filteModel).pipe(
      map((data) => data.ListItems.map(val => ({
        value: val.Id,
        display: val.Title
      })))
    );
  }


  onActionChange(): void {
    const retIds = [];
    this.tagDataModel.forEach(x => { retIds.push(x.id) });
    this.optionChange.emit(retIds);
    // this.optionsData.Select = this.dataModelSelect;
    // if (this.optionsData) {
    //   this.optionsData.data.Select = this.dataModelSelect;
    //   if (this.optionsData.parentMethods && this.optionsData.parentMethods.onActionSelect) {
    //     this.optionsData.parentMethods.onActionSelect(this.dataModelSelect);
    //   }
    // }
  }

  onActionSelectForce(ids: number[]): void {

    if (!ids || ids.length === 0) {
      return;
    }

    const filteModel = new FilterModel();
    ids.forEach(element => {
      if (element > 0) {
        const aaa3 = {
          PropertyName: 'Id',
          Value: element + '',
          SearchType: 0,
          ClauseType: 1
        };
        filteModel.Filters.push(aaa3 as FilterDataModel);
      }
    });

    this.coreModuleTagService.ServiceGetAll(filteModel).pipe(
      map((next) => {
        if (next.IsSuccess) {
          next.ListItems.forEach(val => {
            this.tagDataModel.push({
              value: val.Id,
              display: val.Title
            });
          });
        } else {
          this.toasterService.typeErrorGetAll(next.ErrorMessage);

        }

        return;
      },
        (error) => {

          const title = 'برروی خطا در دریافت طلاعات تگ';
          this.toasterService.typeErrorGetAll(error);
        })).toPromise();
  }


}
