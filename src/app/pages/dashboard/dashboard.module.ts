import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRouting } from './dashboard.routing';
import { DashboardOneComponent } from './one/one.component';
import { DashboardTwoComponent } from './two/two.component';


@NgModule({
  declarations: [DashboardComponent, DashboardOneComponent, DashboardTwoComponent],
  imports: [
    CommonModule,
    DashboardRouting
  ]
})
export class DashboardModule { }
