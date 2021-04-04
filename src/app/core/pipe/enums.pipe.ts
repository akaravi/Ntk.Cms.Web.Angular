import { PipeTransform, Pipe } from '@angular/core';
import { EnumModel } from 'ntk-cms-api';

@Pipe({ name: 'enums' })
export class EnumsPipe implements PipeTransform {
  transform(value, args: EnumModel[]): any {
    return value + '*';
  }
}
// <table>
//   <thead>
//     <tr>
//       <th *ngFor="let head of items[0] | keys">{{head}}</th>
//     </tr>
//   </thead>
//   <tbody>
//     <tr *ngFor="let item of items">
//       <td *ngFor="let list of item | keys">{{item[list]}}</td>
//     </tr>
//   </tbody>
// </table>
