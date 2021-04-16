import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestRoutingModule } from './formbuilder.routing';
import { FormBuilderComponent } from './formbuilder.component';
import { DynamicFormBuilderModule } from 'src/app/core/dynamic-form-builder/dynamic-form-builder.module';


@NgModule({
  imports: [
    TestRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
   SharedModule.forRoot(),
   DynamicFormBuilderModule,
  ],
  declarations: [FormBuilderComponent]
})
export class FormBuilderModule { }
