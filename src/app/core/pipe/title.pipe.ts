import { PipeTransform, Pipe } from '@angular/core';
import { EnumModel } from 'ntk-cms-api';

@Pipe({ name: 'title' })
export class TitlePipe implements PipeTransform {
  transform(value, args: any[]): any {
    if (!value || !args || args.length === 0) {
      return '';
    }
    const find = args.find(x => x.Id === value);
    if (!find) {
      return '';
    }
    return find.Title;
  }
}
