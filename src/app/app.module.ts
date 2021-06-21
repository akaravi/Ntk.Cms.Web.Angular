import { BrowserModule } from '@angular/platform-browser';
import { NgModule, OnInit } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreAuthService, CoreEnumService } from 'ntk-cms-api';
import xml from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
import scss from 'highlight.js/lib/languages/scss';
import typescript from 'highlight.js/lib/languages/typescript';
import { HIGHLIGHT_OPTIONS, HighlightModule } from 'ngx-highlightjs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { SplashScreenModule } from './pages/partials/layout/splash-screen/splash-screen.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
import { TestModule } from './testModules/test/test.module';
import { NtkSmartModalModule } from 'ngx-ntk-smart-module';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HttpConfigInterceptor } from './core/interceptor/httpConfigInterceptor';
import { AppRouting } from './app.routing';
import { CmsStoreModule } from './core/reducers/cmsStore.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedModule } from './shared/shared.module';

export function getHighlightLanguages(): any {
  return [
    { name: 'typescript', func: typescript },
    { name: 'scss', func: scss },
    { name: 'xml', func: xml },
    { name: 'json', func: json },
  ];
}
export function CreateTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    AppComponent,

  ], exports: [

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRouting,
    HttpClientModule,
    TranslateModule.forRoot(),
    SharedModule.forRoot(),
    NtkSmartModalModule.forRoot(),
    ToastrModule.forRoot({
      // timeOut: 0,
      timeOut: 5000,
      enableHtml: true,
      positionClass: 'toast-bottom-right',
      // positionClass: "toast-bottom-full-width",
      preventDuplicates: true,
      closeButton: true,
      // extendedTimeOut: 0,
      extendedTimeOut: 1000,
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (CreateTranslateLoader),
        deps: [HttpClient]
      }
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
    // ErrorDialogService,
    // { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },

  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
