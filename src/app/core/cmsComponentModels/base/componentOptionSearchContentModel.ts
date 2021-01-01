
import { AccessModel, FilterDataModel } from 'ntk-cms-api';
import { ComponentOptionModel } from './componentOptionModel';


export class ComponentOptionSearchContentModel
  implements ComponentOptionModel<ComponentOptionSearchContentDataModel, ComponentOptionSearchContentActionsModel,
  ComponentOptionSearchContentMethodsModel> {
  actions: ComponentOptionSearchContentActionsModel;
  methods: ComponentOptionSearchContentMethodsModel;
  data: ComponentOptionSearchContentDataModel = new ComponentOptionSearchContentDataModel();
  constructor() {
    this.data = new ComponentOptionSearchContentDataModel();
  }
}

export class ComponentOptionSearchContentActionsModel {
  onSubmit: (x: Array<FilterDataModel>) => void;
}
export class ComponentOptionSearchContentMethodsModel {
  setAccess: (x: AccessModel) => void;
}
export class ComponentOptionSearchContentDataModel {
  hidden: boolean;
  Select: any;
  Access: AccessModel;
}
