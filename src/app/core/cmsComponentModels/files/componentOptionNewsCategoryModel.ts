import { ComponentOptionModel } from '../base/componentOptionModel';

export class ComponentOptionFileUploadModel
  // tslint:disable-next-line: max-line-length
  implements ComponentOptionModel<ComponentOptionFileUploadDataModel, ComponentOptionFileUploadActionsModel, ComponentOptionFileUploadMethodsModel> {
    onActions: ComponentOptionFileUploadActionsModel;
  methods: ComponentOptionFileUploadMethodsModel;
  data: ComponentOptionFileUploadDataModel;

}

export class ComponentOptionFileUploadActionsModel {
  onActionSelect: (x: any) => void;
}
export class ComponentOptionFileUploadMethodsModel {
  ActionReload: () => void;
}
export class ComponentOptionFileUploadDataModel {
  fileName: string;
  fileKey: string;
}
