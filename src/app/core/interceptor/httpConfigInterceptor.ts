import { CmsToastrService } from '../services/cmsToastr.service';
import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

  constructor(private router: Router, public cmsToastrService: CmsToastrService) {
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // check to see if there's internet
    if (!window.navigator.onLine) {
      // if there is no internet, throw a HttpErrorResponse error
      // since an error is thrown, the function will terminate here
      this.cmsToastrService.typeErrorInternetConnection();
      return Observable.throw(new HttpErrorResponse({ error: 'Internet is required.' }));
    }
    return next.handle(request).pipe(

      catchError(error => {
        if (error.status === 0) {
          this.cmsToastrService.typeErrorInternetConnection();
        }
        if (error.status === 401) {
          this.cmsToastrService.typeErrorUserToken();
          this.router.navigate(['auth/login']);
        }
        return throwError(error);
      }));
  }
}
