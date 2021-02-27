import { EnumModel, ErrorExceptionResult, TokenInfoModel } from 'ntk-cms-api';

export interface ReducerCmsStore {
    tokenInfoState: TokenInfoModel;
    EnumRecordStatus: ErrorExceptionResult<EnumModel> ;
  }
