import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {TranslationService} from './core/i18n/translation.service';
import {locale as enLang} from './core/i18n/vocabs/en';
import {locale as chLang} from './core/i18n/vocabs/ch';
import {locale as esLang} from './core/i18n/vocabs/es';
import {locale as jpLang} from './core/i18n/vocabs/jp';
import {locale as deLang} from './core/i18n/vocabs/de';
import {locale as frLang} from './core/i18n/vocabs/fr';
import {locale as faLang} from './core/i18n/vocabs/fa';
import {CoreAuthService, EnumDeviceType, EnumOperatingSystemType, TokenDeviceClientInfoDtoModel} from 'ntk-cms-api';
import {environment} from '../environments/environment';
import {SplashScreenService} from './core/partials/layout/splash-screen/splash-screen.service';
import {Subscription} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';

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
    private router: Router) {
    if (environment.cmsServerConfig.configApiServerPath && environment.cmsServerConfig.configApiServerPath.length > 0) {
      this.coreAuthService.setConfig(environment.cmsServerConfig.configApiServerPath);
    }
    this.translationService.loadTranslations(
      faLang,
      enLang,
      chLang,
      esLang,
      jpLang,
      deLang,
      frLang,
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
        Language: '',
        LocationLat: '',
        LocationLong: '',
        SimCard: '',
        NotificationId: ''

      };
      this.coreAuthService.ServiceGetTokenDevice(model).toPromise();
    }
    this.unsubscribe.push(routerSubscription);
  }
  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
