import { AccessModel, FilterDataModel } from 'ntk-cms-api';
import { ComponentOptionModel } from './componentOptionModel';

export class ComponentOptionSearchContentModel
  implements
    ComponentOptionModel<
      ComponentOptionSearchContentDataModel,
      ComponentOptionSearchContentChildMethodsModel,
      ComponentOptionSearchContentParentMethodsModel
    > {
  childMethods: ComponentOptionSearchContentChildMethodsModel;
  parentMethods: ComponentOptionSearchContentParentMethodsModel;
  data: ComponentOptionSearchContentDataModel = new ComponentOptionSearchContentDataModel();
  constructor() {
    this.data = new ComponentOptionSearchContentDataModel();
  }
}

export class ComponentOptionSearchContentChildMethodsModel {
  setAccess: (x: AccessModel) => void;
}
export class ComponentOptionSearchContentParentMethodsModel {
  onSubmit: (x: Array<FilterDataModel>) => void;
}
export class ComponentOptionSearchContentDataModel {
  show = false;
  Select: any;
  Access: AccessModel;
}
