import { AccessModel, FilterDataModel } from 'ntk-cms-api';
import { ComponentOptionModel } from './componentOptionModel';

export class ComponentOptionStatistContentModel
  implements
    ComponentOptionModel<
      ComponentOptionStatistContentDataModel,
      ComponentOptionStatistContentChildMethodsModel,
      ComponentOptionStatistContentParentMethodsModel
    > {
  childMethods: ComponentOptionStatistContentChildMethodsModel;
  parentMethods: ComponentOptionStatistContentParentMethodsModel;
  data: ComponentOptionStatistContentDataModel = new ComponentOptionStatistContentDataModel();
  constructor() {
    this.data = new ComponentOptionStatistContentDataModel();
  }
}

export class ComponentOptionStatistContentChildMethodsModel {
  runStatist: (x:  Array<FilterDataModel>) => void;
}
export class ComponentOptionStatistContentParentMethodsModel {
  onSubmit: (x: Array<FilterDataModel>) => void;
}
export class ComponentOptionStatistContentDataModel {
  show = false;
}
