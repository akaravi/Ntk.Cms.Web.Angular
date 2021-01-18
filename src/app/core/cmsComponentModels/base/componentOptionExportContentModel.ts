import { AccessModel, FilterDataModel } from 'ntk-cms-api';
import { ComponentOptionModel } from './componentOptionModel';

export class ComponentOptionExportContentModel
  implements
    ComponentOptionModel<
      ComponentOptionExportContentDataModel,
      ComponentOptionExportContentChildMethodsModel,
      ComponentOptionExportContentParentMethodsModel
    > {
  childMethods: ComponentOptionExportContentChildMethodsModel;
  parentMethods: ComponentOptionExportContentParentMethodsModel;
  data: ComponentOptionExportContentDataModel = new ComponentOptionExportContentDataModel();
  constructor() {
    this.data = new ComponentOptionExportContentDataModel();
  }
}

export class ComponentOptionExportContentChildMethodsModel {
  runExport: (x:  Array<FilterDataModel>) => void;
}
export class ComponentOptionExportContentParentMethodsModel {
  onSubmit: (x: Array<FilterDataModel>) => void;
}
export class ComponentOptionExportContentDataModel {
  show = false;
}
