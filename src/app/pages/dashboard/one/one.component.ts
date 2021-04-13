import { Component, OnInit } from '@angular/core';
import { CoreModuleModel, CoreModuleService, ErrorExceptionResult } from 'ntk-cms-api';
import { map } from 'rxjs/operators';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { LayoutService } from 'src/app/core/services/layout.service';

@Component({
  selector: 'app-one',
  templateUrl: './one.component.html',
  styleUrls: ['./one.component.scss']
})
export class DashboardOneComponent implements OnInit {
  demo: string;
  dataModelResult: ErrorExceptionResult<CoreModuleModel> = new ErrorExceptionResult<CoreModuleModel>();
  constructor(
    private layout: LayoutService,
    private coreModuleService: CoreModuleService,
    private cmsToastrService: CmsToastrService,
  ) {
    this.coreModuleService.ServiceGetAllModuleName(null).pipe(
      map(next => {
        if (next.IsSuccess) {
          this.dataModelResult = next;
        }
        else {
          this.cmsToastrService.typeErrorEdit(next.ErrorMessage);
        }
      },
        (error) => {
          this.cmsToastrService.typeErrorEdit(error);
        }
      ));
  }

  ngOnInit(): void {
    this.demo = this.layout.getProp('demo');

  }
  CheckModuleExist(name: string): boolean {
    if (!name || name.length === 0 || !this.dataModelResult.ListItems || this.dataModelResult.ListItems.length === 0) {
      return false;
    }
    const retMdule = this.dataModelResult.ListItems.find(x => x.ClassName.toLowerCase() === name.toLowerCase());
    if (retMdule && retMdule.Id > 0) {
      return true;
    }
    return false;
  }
}
