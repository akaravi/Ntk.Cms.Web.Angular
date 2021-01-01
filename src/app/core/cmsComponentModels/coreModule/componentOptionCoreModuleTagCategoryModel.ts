import { CoreModuleTagCategoryModel } from 'ntk-cms-api';
import { ComponentOptionModel } from '../base/componentOptionModel';

// tslint:disable-next-line: max-line-length
export class ComponentOptionCoreModuleTagCategoryModel implements ComponentOptionModel<ComponentOptionCoreModuleTagCategoryDataModel, ComponentOptionCoreModuleTagCategoryActionsModel, ComponentOptionCoreModuleTagCategoryMethodsModel> {
  actions: ComponentOptionCoreModuleTagCategoryActionsModel;
  methods: ComponentOptionCoreModuleTagCategoryMethodsModel;
  data: ComponentOptionCoreModuleTagCategoryDataModel;

}

export class ComponentOptionCoreModuleTagCategoryActionsModel {
  onActionSelect: (x: CoreModuleTagCategoryModel) => void;
}
export class ComponentOptionCoreModuleTagCategoryMethodsModel {
  ActionReload: () => void;
  ActionSelectForce: (id: number) => void;
}
export class ComponentOptionCoreModuleTagCategoryDataModel {
  SelectId: number;
  Select: CoreModuleTagCategoryModel;
}
