import { BrowserModule } from '@angular/platform-browser';
import { NgModule, OnInit } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreAuthService, CoreEnumService } from 'ntk-cms-api';
import xml from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
import scss from 'highlight.js/lib/languages/scss';
import typescript from 'highlight.js/lib/languages/typescript';
import { HIGHLIGHT_OPTIONS, HighlightModule } from 'ngx-highlightjs';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { SplashScreenModule } from './core/partials/layout/splash-screen/splash-screen.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
import { TestModule } from './modules/test/test.module';
import { NtkSmartModalModule } from 'ngx-ntk-smart-module';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HttpConfigInterceptor } from './core/interceptor/httpConfigInterceptor';
import { AppRouting } from './app.routing';
import { CmsStoreModule } from './core/reducers/cmsStore.module';

export function getHighlightLanguages(): any {
  return [
    { name: 'typescript', func: typescript },
    { name: 'scss', func: scss },
    { name: 'xml', func: xml },
    { name: 'json', func: json },
  ];
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRouting,
    HttpClientModule,
    TranslateModule.forRoot(),
    NtkSmartModalModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 0,
      enableHtml: true,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
      extendedTimeOut:0,
    }),
    SplashScreenModule,
    InlineSVGModule.forRoot(),
    CmsStoreModule.forRoot(),
    
    NgbModule,
    HighlightModule,
    ClipboardModule,
    TestModule,

  ],
  providers: [
    CoreAuthService,
    CoreEnumService,
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        languages: getHighlightLanguages,
      },
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
 
}
