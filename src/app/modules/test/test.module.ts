import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestComponent } from './test.component';
// import { FileManagerModule } from 'ng6-file-man';
import { FileManagerModule } from 'ntk-cms-filemanager';
import { TestRoutingModule } from './test-routing.module';


@NgModule({
  imports: [
    TestRoutingModule,
    CommonModule,
    FileManagerModule
  ],
  declarations: [TestComponent]
})
export class TestModule { }
