import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslationService } from './core/i18n/translation.service';
// import { locale as enLang } from '../assets/i18n/en';
// import { locale as chLang } from '../assets/i18n/ch';
// import { locale as esLang } from '../assets/i18n/es';
// import { locale as jpLang } from '../assets/i18n/jp';
// import { locale as deLang } from '../assets/i18n/de';
// import { locale as frLang } from '../assets/i18n/fr';
// import { locale as faLang } from '../assets/i18n/fa';
import { CoreAuthService, CoreEnumService, EnumDeviceType, EnumOperatingSystemType, TokenDeviceClientInfoDtoModel } from 'ntk-cms-api';
import { environment } from '../environments/environment';
import { SplashScreenService } from './pages/partials/layout/splash-screen/splash-screen.service';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { CmsStoreService } from './core/reducers/cmsStore.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AppComponent implements OnInit, OnDestroy {
  unsubscribe: Subscription[] = [];

  constructor(
    private coreAuthService: CoreAuthService,
    private translationService: TranslationService,
    private splashScreenService: SplashScreenService,
    private router: Router,
    private coreEnumService: CoreEnumService,
    private cmsStoreService: CmsStoreService) {
    if (environment.cmsServerConfig.configApiServerPath && environment.cmsServerConfig.configApiServerPath.length > 0) {
      this.coreAuthService.setConfig(environment.cmsServerConfig.configApiServerPath);
    }
    this.translationService.loadTranslations(
      // faLang,
      // enLang,
      // chLang,
      // esLang,
      // jpLang,
      // deLang,
      // frLang,
    );
  }

  ngOnInit(): void {
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.splashScreenService.hide();
        window.scrollTo(0, 0);
        setTimeout(() => {
          document.body.classList.add('page-loaded');
        }, 500);
      }
    });

    this.unsubscribe.push(routerSubscription);

    const DeviceToken = this.coreAuthService.getDeviceToken();
    if (!DeviceToken || DeviceToken.length === 0) {
      const model: TokenDeviceClientInfoDtoModel = {
        SecurityKey: environment.cmsTokenConfig.SecurityKey,
        ClientMACAddress: '',
        OSType: EnumOperatingSystemType.none,
        DeviceType: EnumDeviceType.WebSite,
        PackageName: '',
        AppBuildVer: 0,
        AppSourceVer: '',
        Country: '',
        DeviceBrand: '',
        Language: this.translationService.getSelectedLanguage(),
        LocationLat: '',
        LocationLong: '',
        SimCard: '',
        NotificationId: ''

      };
      this.translationService.setLanguage(this.translationService.getSelectedLanguage());
      this.coreAuthService.ServiceGetTokenDevice(model).toPromise();
    }
    this.unsubscribe.push(routerSubscription);

    this.getEnumRecordStatus();
  }
  getEnumRecordStatus(): void {
    this.coreEnumService.ServiceEnumRecordStatus().subscribe((res) => {
      this.cmsStoreService.setState({ EnumRecordStatus: res });
    });
  }
  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
