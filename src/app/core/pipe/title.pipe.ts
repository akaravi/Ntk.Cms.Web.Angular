import { PipeTransform, Pipe } from '@angular/core';
import { EnumModel } from 'ntk-cms-api';

@Pipe({ name: 'cmstitle' })
export class CmsTitlePipe implements PipeTransform {
  transform(value, args: any[]): any {
    if (!value || !args || args.length === 0) {
      return '';
    }
    const find = args.find(x => x.Id === value);
    if (!find) {
      return value;
    }
    return find.Title;
  }
}
