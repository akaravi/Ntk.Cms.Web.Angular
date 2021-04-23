// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { EnumDeviceType, EnumOperatingSystemType } from 'ntk-cms-api';

export const environment = {
  production: false,
  developing: false,
  appVersion: '14000109',
  USERDATA_KEY: 'authf649fc9a5f55',
  isMockEnabled: true,
  apiUrl: 'api',
  leafletUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  cmsServerConfig: {
    configApiRetry: 0,
    configApiServerPath: 'https://apicms.ir/api/v1/',
    configMvcServerPath: 'https://oco.ir',
    configCpanelImages: '/cpanelv1/images/',
    configPathFileByIdAndName: 'https://oco.ir/files/',
    configRouteThumbnails: 'https://oco.ir/imageThumbnails/',
    configHtmlBuilderServerPath: 'https://htmlbuilder.ntkcms.com/',
    configHtmlViewServerPath: 'https://ntkcms.com/',
    configRouteUploadFileContent: 'https://apifile.ir/api/v1/upload/',
  },
  cmsUiConfig: {
    Pathlogin: '/auth/singin',
    Pathlogout: '/auth/singout',
    PathRegistery: '/auth/registery',
    PathSelectSite: '/core/site/select',
    Pathdashboard: '/dashboard/',
  },
  cmsTokenConfig: {
    SecurityKey: '123456789',
    ClientMACAddress: '',
    OSType: EnumOperatingSystemType.Windows,
    DeviceType: EnumDeviceType.WebSite,
    PackageName: '',
  }
};
