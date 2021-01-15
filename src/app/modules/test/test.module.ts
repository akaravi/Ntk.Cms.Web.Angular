import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestComponent } from './test.component';
// import { FileManagerModule } from 'ng6-file-man';
import { TestRoutingModule } from './test-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    TestRoutingModule,
    CommonModule,

    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
   SharedModule.forRoot(),
  ],
  declarations: [TestComponent]
})
export class TestModule { }
