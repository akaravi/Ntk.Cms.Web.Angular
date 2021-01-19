import { NewsCategoryModel } from 'ntk-cms-api';
import { ComponentOptionModel } from '../base/componentOptionModel';

// tslint:disable-next-line: max-line-length
export class ComponentOptionNewsCategoryModel implements ComponentOptionModel<ComponentOptionNewsCategoryDataModel, ComponentOptionNewsCategoryActionsModel, ComponentOptionNewsCategoryMethodsModel> {
  childMethods = new ComponentOptionNewsCategoryActionsModel();
  parentMethods = new ComponentOptionNewsCategoryMethodsModel();
  data = new ComponentOptionNewsCategoryDataModel();
}
export class ComponentOptionNewsCategoryActionsModel {
  ActionReload: () => void;
  ActionSelectForce: (id: number | NewsCategoryModel) => void;
}
export class ComponentOptionNewsCategoryMethodsModel {
  onActionSelect: (x: NewsCategoryModel) => void;
}
export class ComponentOptionNewsCategoryDataModel {
  Select = new NewsCategoryModel();
}
