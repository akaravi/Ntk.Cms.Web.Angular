import { SmsMainApiPathModel } from 'ntk-cms-api';
import { ComponentOptionModel } from '../base/componentOptionModel';

export class ComponentOptionSmsMainApiPathModel
  // tslint:disable-next-line: max-line-length
  implements ComponentOptionModel<ComponentOptionSmsMainApiPathDataModel, ComponentOptionSmsMainApiPathActionsModel, ComponentOptionSmsMainApiPathMethodsModel> {
  onActions: ComponentOptionSmsMainApiPathActionsModel;
  methods: ComponentOptionSmsMainApiPathMethodsModel;
  data: ComponentOptionSmsMainApiPathDataModel;

}

export class ComponentOptionSmsMainApiPathActionsModel {
  onActionSelect: (x: SmsMainApiPathModel) => void;
}
export class ComponentOptionSmsMainApiPathMethodsModel {
  ActionReload: () => void;
}
export class ComponentOptionSmsMainApiPathDataModel {
  SelectId: number;
  Select: SmsMainApiPathModel;
}
