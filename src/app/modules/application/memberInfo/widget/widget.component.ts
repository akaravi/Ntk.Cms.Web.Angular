import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApplicationAppService, ApplicationMemberInfoService, EnumRecordStatus, FilterDataModel, FilterModel, ntkCmsApiStoreService } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { WidgetInfoModel } from 'src/app/core/models/widget-info-model';

@Component({
  selector: 'app-application-memberinfo-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class ApplicationMemberInfoWidgetComponent implements OnInit, OnDestroy {
  filteModelContent = new FilterModel();
  modelData = new Map<string, number>();
  widgetInfoModel = new WidgetInfoModel();
  cmsApiStoreSubscribe: Subscription;
  indexTheme = ['symbol-light-success', 'symbol-light-warning', 'symbol-light-danger', 'symbol-light-info'];
  constructor(
    private service: ApplicationMemberInfoService,
    private cmsApiStore: ntkCmsApiStoreService,
  ) { }
  ngOnInit(): void {
    this.widgetInfoModel.title = 'کاربران های شما';
    this.widgetInfoModel.description = 'کاربرانی که در اپلیکیشن های شما وارد شده اند';
    this.widgetInfoModel.link = '/application/memberinfo';

    this.onActionStatist();
    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe((next) => {
      this.onActionStatist();
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();

  }

  onActionStatist(): void {
    this.modelData.set('Active', 0);
    this.modelData.set('All', 0);
    this.service.ServiceGetCount(this.filteModelContent).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.modelData.set('All', next.TotalRowCount);
        }
      },
      (error) => {
      }
    );

    const filterStatist1 = this.filteModelContent;
    const fastFilter = new FilterDataModel();
    fastFilter.PropertyName = 'RecordStatus';
    fastFilter.Value = EnumRecordStatus.Available;
    filterStatist1.Filters.push(fastFilter);
    this.service.ServiceGetCount(filterStatist1).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.modelData.set('Active', next.TotalRowCount);
        }
      }
      ,
      (error) => {
      }
    );
  }
}