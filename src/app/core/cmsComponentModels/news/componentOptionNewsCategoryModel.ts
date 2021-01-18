import { NewsCategoryModel } from 'ntk-cms-api';
import { ComponentOptionModel } from '../base/componentOptionModel';

// tslint:disable-next-line: max-line-length
export class ComponentOptionNewsCategoryModel implements ComponentOptionModel<ComponentOptionNewsCategoryDataModel, ComponentOptionNewsCategoryActionsModel, ComponentOptionNewsCategoryMethodsModel> {
  childMethods = new ComponentOptionNewsCategoryActionsModel();
  parentMethods = new ComponentOptionNewsCategoryMethodsModel();
  data = new ComponentOptionNewsCategoryDataModel();
}
export class ComponentOptionNewsCategoryActionsModel {
  onActionSelect: (x: NewsCategoryModel) => void;
}
export class ComponentOptionNewsCategoryMethodsModel {
  ActionReload: () => void;
  ActionSelectForce: (id: number) => void;
}
export class ComponentOptionNewsCategoryDataModel {
  Select = new NewsCategoryModel();
}
