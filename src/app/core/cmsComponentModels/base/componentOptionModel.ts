export interface ComponentOptionModel<TDataModel, TActionModel, TMethodsModel> {
  actions: TActionModel;
  methods: TMethodsModel;
  data: TDataModel;
}
