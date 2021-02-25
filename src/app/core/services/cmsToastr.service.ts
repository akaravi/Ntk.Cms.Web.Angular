import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ErrorExceptionResultBase } from 'ntk-cms-api';

@Injectable({
  providedIn: 'root'
})
export class CmsToastrService {
  constructor(public toastr: ToastrService) {

  }
  private now(): string {
    const myDate = new Date();
    return myDate.getHours() + ' : ' + myDate.getMinutes() + ' : ' + myDate.getSeconds() + ' => ';
  }
  // typeOrderAction
  typeOrderActionLogout(): void {
    this.toastr.success('درحال اجرای خروج از حساب کاربری.', this.now() + 'Info!');
  }
  // Success Type
  typeSuccessAccessChange(): void {
    this.toastr.success('دسترسی با موفقیت تایید شد', this.now() + 'Success!');
  }
  typeSuccessAdd(): void {
    this.toastr.success('با موفقیت اضافه شد', this.now() + 'Success!');
  }
  typeSuccessAddSimilar(): void {
    this.toastr.success('با موفقیت مطالب مشابه اضافه شد', this.now() + 'Success!');
  }
  typeSuccessAddOtherInfo(): void {
    this.toastr.success('با موفقیت سایر اطلاعات اضافه شد', this.now() + 'Success!');
  }
  typeSuccessAddTag(): void {
    this.toastr.success('با موفقیت تگ مشابه اضافه شد', this.now() + 'Success!');
  }
  typeSuccessRemoveTag(): void {
    this.toastr.success('با موفقیت تگ مشابه حذف شد', this.now() + 'Success!');
  }
  typeSuccessRemoveOtherInfo(): void {
    this.toastr.success('با موفقیت سایر اطلاعات حذف شد', this.now() + 'Success!');
  }
  typeSuccessRemoveSimilar(): void {
    this.toastr.success('با موفقیت سایر اطلاعات مشابه حذف شد', this.now() + 'Success!');
  }
  typeSuccessRemove(): void {
    this.toastr.success('با موفقیت حذف شد', this.now() + 'Success!');
  }

  typeSuccessEdit(): void {
    this.toastr.success('با موفقیت ویرایش شد', this.now() + 'Success!');
  }

  typeSuccessMove(): void {
    this.toastr.success('با موفقیت منتقل شد', this.now() + 'Success!');
  }
  typeSuccessLogin(): void {
    this.toastr.success('با موفقیت به حساب کاربری خود وارد شدید', this.now() + 'Success!');
  }
  typeSuccessLogout(): void {
    this.toastr.success('با موفقیت از حساب کاربری خود خارج شدید', this.now() + 'Success!');
  }
  typeSuccessRegistery(): void {
    this.toastr.success('با موفقیت حساب کاربری شما ساخته شد', this.now() + 'Success!');
  }
  typeSuccessSelected(): void {
    this.toastr.success('با موفقیت انتخاب شد', this.now() + 'Success!');
  }
  typeSuccessAppBuild(str: string): void {
    let message = 'دستور ساخت اپ ثب شد';

    if (str && str.length > 0) {
      message = message + ' Message: ' + str;
    }
    this.toastr.success(message, this.now() + 'Success!');
  }
  typeSuccessAppUpload(): void {
    this.toastr.success('با موفقیت آپلود شد', this.now() + 'Success!');
  }
  // error Type
  typeErrorInternetConnection(str: string = ''): void {
    let message = 'خطا در اتصال به اینترنت.لطفا اتصال به اینترنت را بررسی کنید';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'Error!');
  }

  typeErrorUserToken(str: string = ''): void {
    let message = 'حساب کاربری شما مورد تایید نمی باشد.لطفا مجدد وارد حساب کاربری شوید';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'Error!');
  }
  typeErrorAccessChange(str: string = ''): void {
    let message = 'دسترسی جدید تایید نشد';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'Error!');
  }
  typeErrorDeviceToken(str: string = ''): void {
    let message = 'شناسه دستگاه شما مورد تایید نمی باشد.اطفا با پستبانی تماس بگیرید';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'Error!');
  }

  typeErrorComponentAction(str: string = ''): void {
    let message = 'نوع فعالیت در این صفحه مشخص نمی باشد';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'Error!');
  }

  typeErrorFormInvalid(str: string = ''): void {
    let message = 'مقادیر فرم مورد تایید نمی باشد';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'Error!');
  }
  typeErrorGetAccess(str: string = ''): void {
    let message = 'خطا در دریافت دسترسی های ';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'Error!');
  }
  typeErrorAccessAdd(str: string = ''): void {
    let message = 'دسترسی اضافه کردن  ندارید';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'Error!');
  }
  typeErrorAccessEdit(str: string = ''): void {
    let message = 'دسترسی ویرایش کردن ندارید';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'Error!');
  }
  typeErrorAccessDelete(str: string = ''): void {
    let message = 'دسترسی حذف کردن ندارید';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'Error!');
  }
  typeErrorGetOne(str: string = ''): void {
    let message = 'خطا در دریافت ردیف ';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'Error!');
  }

  typeErrorGetAll(str: string = ''): void {
    let message = 'خطا در دریافت لیست ';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'Error!');
  }

  typeErrorAdd(str: string = ''): void {
    let message = 'خطا در اضافه کردن';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'Error!');
  }
  typeErrorAddSimilar(str: string = ''): void {
    let message = 'خطا در اضافه کردن مطالب مشابه';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'Error!');
  }
  typeErrorAddOtherInfo(str: string = ''): void {
    let message = 'خطا در اضافه کردن سایر اطلاعات';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'Error!');
  }
  typeErrorAddTag(str: string = ''): void {
    let message = 'خطا در اضافه کردن تگها';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'Error!');
  }
  typeErrorRemoveTag(str: string = ''): void {
    let message = 'خطا در حذف کردن تگها';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'Error!');
  }
  typeErrorRemoveOtherInfo(str: string = ''): void {
    let message = 'خطا در حذف کردن سایر اطلاعات';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'Error!');
  }
  typeErrorRemoveSimilar(str: string = ''): void {
    let message = 'خطا در حذف کردن اطلاعات مشابه';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'Error!');
  }
  typeErrorGetCpatcha(str: string = ''): void {
    let message = 'خطا در ساخت عکس کپچا';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'Error!');
  }
  typeErrorAddDuplicate(str: string = ''): void {
    let message = 'اطلاعات وارد شده تکراری است';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'Error!');
  }

  typeErrorRemove(str: string = ''): void {
    let message = 'خطا در حذف کردن';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'Error!');
  }

  typeErrorEdit(str: string = ''): void {
    let message = 'خطا در ویرایش کردن';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'Error!');
  }

  typeErrorMove(str: string = ''): void {
    let message = 'خطا در جابجا کردن';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'Error!');
  }

  typeErrorLogin(str: string = ''): void {
    let message = 'در ورود به سامانه خطایی رخ داده است مجدد تلاش کنید';
    if (str && str.length > 0) {
      message = ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'برروز خطا در لاگین!');
  }

  typeErrorEditRowIsNull(str: string = ''): void {
    let message = 'ردیف اطلاعات جهت ویرایش مشخص نیست';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'Error!');
  }

  typeErrorDeleteRowIsNull(str: string = ''): void {
    let message = 'ردیف اطلاعات جهت حذف مشخص نیست';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'Error!');
  }

  typeErrorAddRowParentIsNull(str: string = ''): void {
    let message = 'ردیف والد اطلاعات جهت ثبت مشخص نیست';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'Error!');
  }
  typeErrorLogout(str: string = ''): void {
    let message = 'برروز خطا در خارج شدن از حساب کاربری';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'Error!');
  }
  typeErrorRegistery(str: string = ''): void {
    let message = 'برروز خطا در ایجاد حساب کاربری';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'Error!');
  }
  typeErrorSelected(str: string = ''): void {
    let message = 'برروز خطا در انتخاب';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'Error!');
  }
  typeError(model: any, str: string = ''): void {
    let message = 'برروز خطا ' + ' ' + str;
    if (!model) {
      this.toastr.error(message, this.now() + 'Error!');
      return;
    }
    let errorExceptionResult: ErrorExceptionResultBase;
    if (model.error) {
      errorExceptionResult = model.error;
      if (errorExceptionResult) {
        if (errorExceptionResult.Status === 401) {
          message = 'نیاز به ورود مجدد' + ' ' + str;

          this.toastr.error(message, this.now() + 'Error!');
          return;
        }
      }
    }
    if (model.errors) {
      console.log(model.errors);
      message = 'View Console Log' + ' ' + str;
      this.toastr.error(message, this.now() + 'Error!');
      return;
    } else if (model && model.ErrorMessage) {

      message = model.ErrorMessage + ' ' + str;
      this.toastr.error(message, this.now() + 'Error!');
    }
    message = (model.message) ? model.message : model.status ? `${model.status} - ${model.statusText}` : 'Server error';
    this.toastr.error(message, this.now() + 'Error!');

    return;

  }

  typeErrorForNotComplete(str: string = ''): void {
    let message = 'فرم کامل نیست';
    if (str && str.length > 0) {
      message = message + ' error: ' + str;
    }
    this.toastr.error(message, this.now() + 'Error!');
  }
}
