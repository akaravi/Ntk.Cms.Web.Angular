import { Injectable } from '@angular/core';
import { CmsStore, CoreEnumService } from 'ntk-cms-api';
import { ReducerCmsStore } from './reducer.factory';

@Injectable({
    providedIn: 'root',
})
export class CmsStoreService extends CmsStore<ReducerCmsStore> {

}
