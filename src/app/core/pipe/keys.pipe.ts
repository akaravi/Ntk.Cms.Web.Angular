import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {
  transform(value): any {
    let retOut = Object.keys(value);
    retOut = retOut.filter(x => x && x.length > 0 && x.toLowerCase().indexOf('antiinjection') < 0);
    return retOut;
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
//
// <table>
// <thead>
//   <tr>
//     <th *ngFor="let head of dataModel | keys">{{head}}</th>
//   </tr>
// </thead>
// <tbody>
//   <tr>
//     <td *ngFor="let list of dataModel | keys">{{dataModel[list]}}</td>
//   </tr>
// </tbody>
// </table>
//
// <table>
// <thead>
//   <tr>
//     <th>
//       پارامتر
//     </th>
//     <th>
//       مقادیر
//     </th>
//   </tr>
// </thead>
// <tbody>
//   <tr *ngFor="let head of dataModel | keys">
//     <td>{{head}}</td>
//     <td>{{dataModel[head]}}</td>
//   </tr>
// </tbody>
// </table>
