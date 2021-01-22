import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorExceptionResultBase } from 'ntk-cms-api';
import { environment } from 'src/environments/environment';
import { CmsToastrService } from './cmsToastr.service';

@Injectable({
  providedIn: 'root',
})
export class PublicHelper {
  constructor(
    private router: Router,
    private toastrService: CmsToastrService
  ) {}

  CheckError(model: any): any {
    if (!model) {
      return 'Error';
    }
    let errorExceptionResult: ErrorExceptionResultBase;
    if (model.error) {
      errorExceptionResult = model.error;
      if (errorExceptionResult) {
        if (errorExceptionResult.Status === 401) {
          this.toastrService.toastr.warning(
            'لطفا مجددا وارد حساب کاربری خود شوید',
            'نیاز به ورود مجدد'
          );
          this.router.navigate([environment.cmsUiConfig.Pathlogin]);
          return;
        }
      }
    }
    if (model.errors) {
      return '';
    } else if (model && model.ErrorMessage) {
      return model.ErrorMessage;
    }
    return 'Error';
  }

  LocaleDate(model): string {
    const d = new Date(model);
    return d.toLocaleDateString('fa-Ir');
  }

  Truncate(value: string, limit: number = 20, trail: string = '...'): string {
    return value.length > limit ? value.substring(0, limit) + trail : value;
  }

  RecordStatus(model): string {
    return this.RecordStatus[model];
  }

  listAddIfNotExist(listStr: string[], item: string, index: number): string[] {
    if (listStr.indexOf(item) < 0) {
      listStr.splice(index, 0, item);
    }
    return listStr;
  }
  listRemoveIfExist(listStr: string[], item: string): string[] {
    const index = listStr.indexOf(item);
    if (index < 0) {
      return listStr;
    }
    listStr.splice(index, 1);
    return listStr;
  }
}
