import { Component, OnDestroy, OnInit } from '@angular/core';
import { CoreSiteService, EnumRecordStatus, FilterDataModel, FilterModel, ntkCmsApiStoreService, TokenInfoModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { WidgetInfoModel } from 'src/app/core/models/widget-info-model';
import { PersianCalendarService } from 'src/app/core/pipe/PersianDatePipe/persian-date.service';

@Component({
  selector: 'app-core-site-widget-status',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class CoreSiteWidgetStatusComponent implements OnInit, OnDestroy {
  tokenInfoModel = new TokenInfoModel();
  filteModelContent = new FilterModel();
  modelData = new Map<string, string>();
  widgetInfoModel = new WidgetInfoModel();
  cmsApiStoreSubscribe: Subscription;
  indexTheme = ['symbol-light-success', 'symbol-light-warning', 'symbol-light-danger', 'symbol-light-info', 'symbol-light-info', 'symbol-light-info']
  constructor(
    private service: CoreSiteService,
    private cmsApiStore: ntkCmsApiStoreService,
    private persianCalendarService: PersianCalendarService
  ) { }
  ngOnInit(): void {
    this.widgetInfoModel.title = 'سایت فعال :';
    this.widgetInfoModel.description = '';
    this.widgetInfoModel.link = '/core/site';

    this.onActionStatist();
    this.tokenInfoModel = this.cmsApiStore.getStateSnapshot().ntkCmsAPiState.tokenInfo;
    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe((next) => {
      this.tokenInfoModel = next;
      this.onActionStatist();
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();

  }

  onActionStatist(): void {
    if (!this.tokenInfoModel.SiteId || this.tokenInfoModel.SiteId <= 0) {
      return;
    }
    this.widgetInfoModel.link = '/core/site/edit/' + this.tokenInfoModel.SiteId;
    this.modelData.set('Id', this.tokenInfoModel.SiteId + '');
    this.modelData.set('Title', '...');
    this.modelData.set('Domain', '...');
    this.modelData.set('Sub Domain', '...');
    this.modelData.set('Created Date', '...');
    this.modelData.set('Expire Date', '...');
    this.service.ServiceGetOneById(this.tokenInfoModel.SiteId).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.modelData.set('Title', next.Item.Title);
          this.modelData.set('Domain', next.Item.Domain);
          this.modelData.set('Sub Domain', next.Item.SubDomain);
          this.modelData.set('Created Date', this.persianCalendarService.PersianCalendar(next.Item.CreatedDate));
          if (next.Item.ExpireDate) {
            this.modelData.set('Expire Date', this.persianCalendarService.PersianCalendar(next.Item.ExpireDate));
          }
        }
      },
      (error) => {
      }
    );

  }
}
