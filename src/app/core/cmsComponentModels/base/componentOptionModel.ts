export interface ComponentOptionModel<TDataModel, TActionModel, TMethodsModel> {
  onActions: TActionModel;
  methods: TMethodsModel;
  data: TDataModel;
}
