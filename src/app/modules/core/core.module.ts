import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreComponent } from './core.component';
import { CoreRoutes } from './core.routing';
import { UserComponent } from './user/coreUser.component';

@NgModule({
  imports: [
    CoreRoutes,
    CommonModule
  ],
  declarations: [CoreComponent, UserComponent]
})
export class CoreModule { }
