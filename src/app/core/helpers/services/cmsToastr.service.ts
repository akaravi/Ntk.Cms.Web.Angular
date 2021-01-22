import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {ErrorExceptionResultBase} from 'ntk-cms-api';

@Injectable({
  providedIn: 'root'
})
export class CmsToastrService {
  constructor(public toastr: ToastrService) {
  }

  // Success Type
  typeSuccessAdd(): void {
    this.toastr.success('با موفقیت اضافه شد', 'Success!');
  }

  typeSuccessRemove(): void {
    this.toastr.success('با موفقیت حذف شد', 'Success!');
  }

  typeSuccessEdit(): void {
    this.toastr.success('با موفقیت ویرایش شد', 'Success!');
  }

  typeSuccessMove(): void {
    this.toastr.success('با موفقیت منتقل شد', 'Success!');
  }

  // error Type
  typeErrorInternetConnection(str: string = ''): void {
    let message = 'خطا در اتصال به اینترنت.لطفا اتصال به اینترنت را بررسی کنید';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, 'Error!');
  }

  typeErrorUserToken(str: string = ''): void {
    let message = 'حساب کاربری شما مورد تایید نمی باشد.لطفا مجدد وارد حساب کاربری شوید';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, 'Error!');
  }

  typeErrorDeviceToken(str: string = ''): void {
    let message = 'شناسه دستگاه شما مورد تایید نمی باشد.اطفا با پستبانی تماس بگیرید';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, 'Error!');
  }

  typeErrorComponentAction(str: string = ''): void {
    let message = 'نوع فعالیت در این صفحه مشخص نمی باشد';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, 'Error!');
  }

  typeErrorFormInvalid(str: string = ''): void {
    let message = 'مقادیر فرم مورد تایید نمی باشد';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, 'Error!');
  }

  typeErrorGetOne(str: string = ''): void {
    let message = 'خطا در دریافت ردیف ';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, 'Error!');
  }

  typeErrorGetAll(str: string = ''): void {
    let message = 'خطا در دریافت لیست ';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, 'Error!');
  }

  typeErrorAdd(str: string = ''): void {
    let message = 'خطا در اضافه کردن';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, 'Error!');
  }

  typeErrorRemove(str: string = ''): void {
    let message = 'خطا در حذف کردن';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, 'Error!');
  }

  typeErrorEdit(str: string = ''): void {
    let message = 'خطا در ویرایش کردن';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, 'Error!');
  }

  typeErrorMove(str: string = ''): void {
    let message = 'خطا در جابجا کردن';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, 'Error!');
  }

  typeErrorLogin(str: string = ''): void {
    let message = 'در ورود به سامانه خطایی رخ داده است مجدد تلاش کنید';
    if (str && str.length > 0) {
      message = ' error: ' + str;
    }
    this.toastr.error(message, 'برروز خطا در لاگین!');
  }

  typeErrorEditRowIsNull(str: string = ''): void {
    let message = 'ردیف اطلاعات جهت ویرایش مشخص نیست';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, 'Error!');
  }

  typeErrorDeleteRowIsNull(str: string = ''): void {
    let message = 'ردیف اطلاعات جهت حذف مشخص نیست';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, 'Error!');
  }

  typeErrorAddRowParentIsNull(str: string = ''): void {
    let message = 'ردیف والد اطلاعات جهت ثبت مشخص نیست';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, 'Error!');
  }

  typeError(model: any, str: string = ''): void {
    let message = 'برروز خطا ' + ' ' + str;
    if (!model) {
      this.toastr.error(message, 'Error!');
      return;
    }
    let errorExceptionResult: ErrorExceptionResultBase;
    if (model.error) {
      errorExceptionResult = model.error;
      if (errorExceptionResult) {
        if (errorExceptionResult.Status === 401) {
          message = 'نیاز به ورود مجدد' + ' ' + str;

          this.toastr.error(message, 'Error!');
          return;
        }
      }
    }
    if (model.errors) {
      console.log(model.errors);
      message = 'View Console Log' + ' ' + str;
      this.toastr.error(message, 'Error!');
      return;
    } else if (model && model.ErrorMessage) {

      message = model.ErrorMessage + ' ' + str;
      this.toastr.error(message, 'Error!');
    }
    return;

  }

  typeErrorForNotComplete(str: string = ''): void {
    let message = 'فرم کامل نیست';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, 'Error!');
  }
}
