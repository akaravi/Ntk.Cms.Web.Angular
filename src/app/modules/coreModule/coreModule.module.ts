import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModuleComponent } from './coreModule.component';
import { CoreModuleRoutes } from './coreModule.routing';

@NgModule({
  imports: [
    CoreModuleRoutes,
    CommonModule
  ],
  declarations: [CoreModuleComponent]
})
export class CoreModuleModule { }
