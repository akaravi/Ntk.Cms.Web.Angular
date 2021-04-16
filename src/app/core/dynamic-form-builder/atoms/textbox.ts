import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

// text,email,tel,textarea,password,
@Component({
  selector: 'textbox',
  template: `
        <input *ngIf="!field.multiline" [attr.type]="field.type" class="form-control"  [id]="field.name" [name]="field.name" [formControl]="form">
        <textarea *ngIf="field.multiline" [class.is-invalid]="isDirty && !isValid" [formControl]="form" [id]="field.name"
        rows="9" class="form-control" [placeholder]="field.placeholder"></textarea>
    `
})
export class TextBoxComponent {
  @Input() field: any = {};
  @Input() form: FormControl;
  get isValid() { return this.form.valid; }
  get isDirty() { return this.form.dirty; }

  constructor() {

  }
}
