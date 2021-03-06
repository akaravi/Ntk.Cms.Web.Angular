import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestRoutingModule } from './barcode.routing';
import { BarcodeComponent } from './barcode.component';
import { ZXingScannerModule } from 'angular-weblineindia-qrcode-scanner';


@NgModule({
  imports: [
    TestRoutingModule,
    CommonModule,
    ZXingScannerModule,

    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
   SharedModule.forRoot(),
  ],
  declarations: [BarcodeComponent]
})
export class BarcodeModule { }
