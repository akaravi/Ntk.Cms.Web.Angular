import { Routes, RouterModule } from '@angular/router';
import { BarcodeComponent } from './barcode.component';

const routes: Routes = [
  {
    path: '',
    component: BarcodeComponent,
  },
];
export const TestRoutingModule = RouterModule.forChild(routes);
