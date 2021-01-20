import { AccessModel, FilterDataModel } from 'ntk-cms-api';
import { ComponentOptionModel } from './componentOptionModel';

export class ComponentOptionStatistModel
  implements
    ComponentOptionModel<
      ComponentOptionStatistDataModel,
      ComponentOptionStatistChildMethodsModel,
      ComponentOptionStatistParentMethodsModel
    > {
  childMethods: ComponentOptionStatistChildMethodsModel;
  parentMethods: ComponentOptionStatistParentMethodsModel;
  data: ComponentOptionStatistDataModel = new ComponentOptionStatistDataModel();
  constructor() {
    this.data = new ComponentOptionStatistDataModel();
  }
}

export class ComponentOptionStatistChildMethodsModel {
  runStatist: (x:  Array<FilterDataModel>) => void;
}
export class ComponentOptionStatistParentMethodsModel {
  onSubmit: (x: Array<FilterDataModel>) => void;
}
export class ComponentOptionStatistDataModel {
  show = false;
}
