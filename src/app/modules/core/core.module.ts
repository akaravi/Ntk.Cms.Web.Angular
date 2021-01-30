import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreComponent } from './core.component';
import { CoreRoutes } from './core.routing';

@NgModule({
  imports: [
    CoreRoutes,
    CommonModule
  ],
  declarations: [CoreComponent]
})
export class CoreModule { }
