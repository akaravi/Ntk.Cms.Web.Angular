import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
// import {TreeModel, NodeInterface, ConfigInterface, DownloadModeEnum} from 'ng6-file-man';
import {
  TreeModel,
  NodeInterface,
  ConfigInterface,
  DownloadModeEnum,
} from 'ntk-cms-filemanager';
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
