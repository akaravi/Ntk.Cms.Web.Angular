import { Routes, RouterModule } from '@angular/router';
import { FormBuilderComponent } from './formbuilder.component';

const routes: Routes = [
  {
    path: '',
    component: FormBuilderComponent,
  },
];
export const TestRoutingModule = RouterModule.forChild(routes);
