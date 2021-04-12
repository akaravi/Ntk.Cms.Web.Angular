import { AccessModel, FilterDataModel } from 'ntk-cms-api';
import { ComponentOptionModel } from './componentOptionModel';

export class ComponentOptionExportModel
  implements
  ComponentOptionModel<
  ComponentOptionExportDataModel,
  ComponentOptionExportChildMethodsModel,
  ComponentOptionExportParentMethodsModel
  > {
  childMethods: ComponentOptionExportChildMethodsModel;
  parentMethods: ComponentOptionExportParentMethodsModel;
  data: ComponentOptionExportDataModel = new ComponentOptionExportDataModel();
  constructor() {
    this.data = new ComponentOptionExportDataModel();
  }
}

export class ComponentOptionExportChildMethodsModel {
  runExport: (x: Map<string, string>) => void;
}
export class ComponentOptionExportParentMethodsModel {
  onSubmit: (x: Map<string, string>) => void;
}
export class ComponentOptionExportDataModel {
  show = false;
}
