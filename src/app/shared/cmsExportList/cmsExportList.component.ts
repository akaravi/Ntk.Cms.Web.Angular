import { FilterDataModel } from 'ntk-cms-api';
import { EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ComponentOptionExportModel } from 'src/app/core/cmsComponentModels/base/componentOptionExportModel';
import { Output } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-cms-export-list',
  templateUrl: './cmsExportList.component.html',
  styleUrls: ['./cmsExportList.component.scss']
})
export class CmsExportListComponent implements OnInit {
  public optionsData: ComponentOptionExportModel = new ComponentOptionExportModel();
  @Output()
  optionsChange: EventEmitter<ComponentOptionExportModel> = new EventEmitter<ComponentOptionExportModel>();
  @Input() set options(model: ComponentOptionExportModel) {
    if (!model) {
      model = new ComponentOptionExportModel();
    }
    this.optionsData = model;
    this.optionsData.childMethods = {
      runExport: (model: Array<FilterDataModel>) => this.runExport(model),
    };
    this.optionsChange.emit(model);
  }
  get options(): ComponentOptionExportModel {
    return this.optionsData;
  }
  constructor() {}

  ngOnInit(): void {}
  runExport(model: Array<FilterDataModel>): void {
    // todo: karavi;
  }
}
