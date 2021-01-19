import { ComponentOptionModel } from './componentOptionModel';

// tslint:disable-next-line: max-line-length
export class ComponentOptionSelectorModel<TModel> implements ComponentOptionModel<ComponentOptionSelectorDataModel<TModel>, ComponentOptionSelectorActionsModel<TModel>, ComponentOptionSelectorMethodsModel<TModel>> {
  childMethods = new ComponentOptionSelectorActionsModel<TModel>();
  parentMethods = new ComponentOptionSelectorMethodsModel<TModel>();
  data = new ComponentOptionSelectorDataModel<TModel>();
}
export class ComponentOptionSelectorActionsModel<TModel> {
  ActionReload: () => void;
  ActionSelectForce: (id: number | TModel) => void;
}
export class ComponentOptionSelectorMethodsModel<TModel> {
  onActionSelect: (x: TModel) => void;
}
export class ComponentOptionSelectorDataModel<TModel> {
  Select: TModel;
  placeholder = 'Select ...';
}
