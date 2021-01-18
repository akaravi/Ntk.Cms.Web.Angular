import {  SmsMainApiPathCompanyModel } from 'ntk-cms-api';
import { ComponentOptionModel } from '../base/componentOptionModel';

export class ComponentOptionSmsMainApiPathCompanyModel
  implements ComponentOptionModel<ComponentOptionSmsMainApiPathCompanyDataModel, ComponentOptionSmsMainApiPathCompanyActionsModel, ComponentOptionSmsMainApiPathCompanyMethodsModel> {
    childMethods: ComponentOptionSmsMainApiPathCompanyActionsModel;
    parentMethods: ComponentOptionSmsMainApiPathCompanyMethodsModel;
  data: ComponentOptionSmsMainApiPathCompanyDataModel;

}

export class ComponentOptionSmsMainApiPathCompanyActionsModel {
  onActionSelect: (x: SmsMainApiPathCompanyModel) => void;
}
export class ComponentOptionSmsMainApiPathCompanyMethodsModel {
  ActionReload: () => void;
}
export class ComponentOptionSmsMainApiPathCompanyDataModel {
  SelectId: number;
  Select: SmsMainApiPathCompanyModel;
}
