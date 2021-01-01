import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {CoreCpMainMenuService} from 'ntk-cms-api';

@Injectable()
export class AsideResolver implements Resolve<any> {
  constructor(private coreCpMainMenuService: CoreCpMainMenuService) {
  }

  resolve(): Observable<any> {
    return this.coreCpMainMenuService.ServiceGetAllMenu(null);
  }
}
