import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-formbuilder',
  templateUrl: './formbuilder.component.html',
  styleUrls: ['./formbuilder.component.scss']
})
export class FormBuilderComponent implements OnInit {
  public form: FormGroup;
  unsubcribe: any;

  public fields: any[] = [
    {
      type: 'text',
      name: 'firstName',
      label: 'First Name',
      value: 'First Name',
      required: true,
    },
    {
      type: 'date',
      name: 'birthDate',
      label: 'Birth date',
      value: '2020-02-15',
      required: true,
    },
    {
      type: 'text',
      name: 'email',
      label: 'Email',
      value: '',
      required: true,
    },

    {
      type: 'file',
      name: 'picture',
      label: 'Picture',
      required: false,
      onUpload: this.onUpload.bind(this)
    },
    {
      type: 'dropdown',
      name: 'country',
      label: 'Country',
      value: 'in',
      required: true,
      options: [
        { key: 'in', label: 'India' },
        { key: 'us', label: 'USA' }
      ]
    },
    {
      type: 'radio',
      name: 'gender',
      label: 'Gender',
      value: 'in',
      required: true,
      options: [
        { key: 'm', label: 'Male' },
        { key: 'f', label: 'Female' }
      ]
    },
    {
      type: 'checkbox',
      name: 'hobby',
      label: 'Hobby',
      required: true,
      options: [
        { key: 'f', label: 'Fishing' },
        { key: 'c', label: 'Cooking' }
      ]
    }
  ];

  constructor() {
    this.form = new FormGroup({
      fields: new FormControl(JSON.stringify(this.fields))
    });
    this.unsubcribe = this.form.valueChanges.subscribe((update) => {
      console.log(update);
      // this.fields = JSON.parse(update.fields);
    });
  }
  ngOnInit(): void {
    // this.form = new FormGroup({});

  }

  onUpload(e): void {
    console.log(e);

  }

  getFields(): any {
    return this.fields;
  }

  ngDistroy(): void {
    this.unsubcribe();
  }
}
