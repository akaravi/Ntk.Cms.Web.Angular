import { CmsToastrService } from '../services/cmsToastr.service';
import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
// import { ErrorDialogService } from './errordialog.service';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    public cmsToastrService: CmsToastrService,
    // public errorDialogService: ErrorDialogService
  ) {
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // check to see if there's internet
    if (!window.navigator.onLine) {
      // if there is no internet, throw a HttpErrorResponse error
      // since an error is thrown, the function will terminate here
      this.cmsToastrService.typeErrorInternetConnection();
      // tslint:disable-next-line: deprecation
      return Observable.throw(new HttpErrorResponse({ error: 'Internet is required.' }));
    }
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // console.log('event--->>>', event);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 0) {
          this.cmsToastrService.typeErrorInternetConnection();
          return;
        }
        if (error.status === 401) {
          this.cmsToastrService.typeErrorUserToken();
          this.router.navigate(['auth/login']);
          return;
        }
        if (error && error.error && error.error.reason) {
          this.cmsToastrService.typeError(error.status, error.error.reason);
          return;
        }
        this.cmsToastrService.typeError(error.status);
        // let data = {};
        // data = {
        //   reason: error && error.error && error.error.reason ? error.error.reason : '',
        //   status: error.status
        // };
        // this.errorDialogService.openDialog(data);
        return throwError(error);
      }));


    // catchError(error => {
    //   if (error.status === 0) {
    //     this.cmsToastrService.typeErrorInternetConnection();
    //   }
    //   if (error.status === 401) {
    //     this.cmsToastrService.typeErrorUserToken();
    //     this.router.navigate(['auth/login']);
    //   }
    //   return throwError(error);
    // }));
  }
}
