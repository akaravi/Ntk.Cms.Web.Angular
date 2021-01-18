import { FilterDataModel } from 'ntk-cms-api';
import { EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ComponentOptionExportContentModel } from 'src/app/core/cmsComponentModels/base/componentOptionExportContentModel';
import { Output } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-cms-export-content-list',
  templateUrl: './cmsExportContentList.component.html',
  styleUrls: ['./cmsExportContentList.component.scss']
})
export class CmsExportContentListComponent implements OnInit {
  public optionsData: ComponentOptionExportContentModel = new ComponentOptionExportContentModel();
  @Output()
  optionsChange: EventEmitter<ComponentOptionExportContentModel> = new EventEmitter<ComponentOptionExportContentModel>();
  @Input() set options(model: ComponentOptionExportContentModel) {
    if (!model) {
      model = new ComponentOptionExportContentModel();
    }
    this.optionsData = model;
    this.optionsData.childMethods = {
      runExport: (model:  Array<FilterDataModel>) => this.runExport(model),
    };
    this.optionsChange.emit(model);
  }
  get options(): ComponentOptionExportContentModel {
    return this.optionsData;
  }
  constructor() {}

  ngOnInit(): void {}
  runExport(model:  Array<FilterDataModel>): void {
    //todo: karavi;
  }
}
