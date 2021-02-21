import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  Validators,
} from '@angular/forms';
import { CmsFormsErrorStateMatcher } from 'src/app/core/pipe/cmsFormsErrorStateMatcher';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  constructor() {}

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  matcher = new CmsFormsErrorStateMatcher();
  ngOnInit(): void {}
}
