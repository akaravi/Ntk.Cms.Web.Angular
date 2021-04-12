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
  constructor() { }
  public optionsData: ComponentOptionExportModel = new ComponentOptionExportModel();
  @Output() optionsChange: EventEmitter<ComponentOptionExportModel> = new EventEmitter<ComponentOptionExportModel>();
  @Input() set options(model: ComponentOptionExportModel) {
    if (!model) {
      model = new ComponentOptionExportModel();
    }
    this.optionsData = model;
    this.optionsData.childMethods = {
      runExport: (x: Map<string, string>) => this.runExport(x),
    };
    this.optionsChange.emit(model);
  }
  get options(): ComponentOptionExportModel {
    return this.optionsData;
  }
  modelData: Map<string, string> = new Map<string, string>();
  ngOnInit(): void { }
  runExport(model: Map<string, string>): void {
    this.modelData = model;
  }
}
