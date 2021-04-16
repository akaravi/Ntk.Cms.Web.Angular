import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// https://stackblitz.com/edit/angular-dynamic-form-builder-9nybhu?file=app%2Fapp.component.html
@Component({
  selector: 'dynamic-form-builder',
  template: `
    <form [formGroup]="formGroup" class="form-horizontal">
      <div *ngFor="let field of fields">
          <field-builder [field]="field" [form]="formGroup"></field-builder>
      </div>
      <div class="form-row"></div>
      <div class="form-group row">
        <div class="col-md-3"></div>
        <div class="col-md-9">
          <button type="submit" [disabled]="!formGroup.valid" class="btn btn-primary">Save</button>
          <strong >Saved all values</strong>
        </div>
      </div>
    </form>
  `,
})
export class DynamicFormBuilderComponent implements OnInit {
  @Output() onSubmit = new EventEmitter();
  @Input() fields: any[] = [];
  @Input() formGroup: FormGroup;
  constructor() { }

  ngOnInit() {
    let fieldsCtrls = {};
    for (let f of this.fields) {
      if (f.type != 'checkbox') {
        fieldsCtrls[f.name] = new FormControl(f.value || '', Validators.required)
      } else {
        let opts = {};
        for (let opt of f.options) {
          opts[opt.key] = new FormControl(opt.value);
        }
        fieldsCtrls[f.name] = new FormGroup(opts)
      }
    }
    //this.form = new FormGroup(fieldsCtrls);
  }
}
