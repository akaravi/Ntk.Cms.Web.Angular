import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './fileUpload.component';
import { FlowInjectionToken, NgxFlowModule } from '@flowjs/ngx-flow';
import Flow from '@flowjs/flow.js';

@NgModule({
  imports: [
    CommonModule,
    NgxFlowModule,
  ],
  declarations: [
    FileUploadComponent
  ],
  exports: [
    FileUploadComponent
  ],
  providers: [
    {
      provide: FlowInjectionToken,
      useValue: Flow,
    },
  ]
})
export class FileUploadModule { }
