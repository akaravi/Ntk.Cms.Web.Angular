import { Output, Input } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';

import { AccessModel, FilterDataModel } from 'ntk-cms-api';
import { ComponentOptionStatistContentModel } from 'src/app/core/cmsComponentModels/base/componentOptionStatistContentModel';

@Component({
  selector: 'app-cms-statist-content-list',
  templateUrl: './cmsStatistContentList.component.html',
  styleUrls: ['./cmsStatistContentList.component.scss'],
})
export class CmsStatistContentListComponent implements OnInit {
  public optionsData: ComponentOptionStatistContentModel = new ComponentOptionStatistContentModel();
  @Output()
  optionsChange: EventEmitter<ComponentOptionStatistContentModel> = new EventEmitter<ComponentOptionStatistContentModel>();
  @Input() set options(model: ComponentOptionStatistContentModel) {
    if (!model) {
      model = new ComponentOptionStatistContentModel();
    }
    this.optionsData = model;
    this.optionsData.childMethods = {
      runStatist: (model:  Array<FilterDataModel>) => this.runStatist(model),
    };
    this.optionsChange.emit(model);
  }
  get options(): ComponentOptionStatistContentModel {
    return this.optionsData;
  }
  constructor() {}

  ngOnInit(): void {}
  runStatist(model:  Array<FilterDataModel>): void {
    //todo: karavi;
  }
}
