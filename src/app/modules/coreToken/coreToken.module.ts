import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreTokenComponent } from './coreToken.component';
import { CoreTokenRoutes } from './coreToken.routing';

@NgModule({
  imports: [
    CoreTokenRoutes,
    CommonModule
  ],
  declarations: [CoreTokenComponent]
})
export class CoreTokenModule { }
