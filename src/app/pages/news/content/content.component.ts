import {Component, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ErrorExceptionResult, FilterModel, NewsContentModel, NewsContentService} from 'ntk-cms-api';
import {PublicHelper} from '../../../_helpers/services/publicHelper';
import {QueryBuilderConfig} from 'angular2-query-builder';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  query: any;
  checked = false;
  config: QueryBuilderConfig = {
    fields: {
      age: {name: 'Age', type: 'number'},
      gender: {
        name: 'Gender',
        type: 'category',
        options: [
          {name: 'Male', value: 'm'},
          {name: 'Female', value: 'f'}
        ]
      }
    }
  };
  displayedColumns: string[] = [
    'LinkSiteId',
    'RecordStatus',
    'Title',
    'CreatedDate',
    'UpdatedDate'];
  dataSource: any;
  dataModelResult: ErrorExceptionResult<NewsContentModel> = new ErrorExceptionResult<NewsContentModel>();
  filterModelContent = new FilterModel();

  constructor(
    private activatedRoute: ActivatedRoute,
    public publicHelper: PublicHelper,
    private newsContentService: NewsContentService) {
  }

  ngOnInit(): void {
    this.dataModelResult = this.activatedRoute.snapshot.data.list.ListItems;
    this.dataSource = this.dataModelResult;
  }

  changed(event): void {
    this.checked = event.checked;
  }

  getContentListById(event): any {
    this.filterModelContent.Filters = [];
    this.filterModelContent.Filters.push({
      BooleanValue1: false,
      ClauseType: undefined,
      DateTimeValue1: undefined,
      DateTimeValue2: undefined,
      DecimalForceNullSearch: false,
      DecimalValue1: null,
      DecimalValue2: null,
      EnumValue1: '',
      Filters: [],
      HierarchyIdLevel: null,
      IntContainValues: [],
      IntValue2: null,
      IntValueForceNullSearch: false,
      LatitudeLongitudeDistanceValue1: null,
      LatitudeLongitudeDistanceValue2: null,
      LatitudeLongitudeForceNullSearch: false,
      LatitudeLongitudeSortType: '',
      LatitudeValue1: null,
      LatitudeValue2: null,
      ObjectIdContainValues: [],
      ObjectIdValue1: '',
      PropertyAnyName: '',
      SearchType: undefined,
      SingleValue1: null,
      SingleValue2: null,
      StringContainValues: [],
      StringForceNullSearch: false,
      StringValue1: '',
      Value: undefined,
      PropertyName: 'LinkCategoryId',
      IntValue1: event.id
    });
    return this.newsContentService.ServiceGetAll(this.filterModelContent).subscribe((res) => {
      if (res.IsSuccess) {
        this.dataSource = [];
        this.dataSource = res.ListItems;
      }
    });
  }
}
