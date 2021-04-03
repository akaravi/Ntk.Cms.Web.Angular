import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {
  transform(value, args: string[]): any {
    return Object.keys(value);
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
