import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  Validators,
} from '@angular/forms';
import { BarcodeFormat } from '@zxing/library';


@Component({
  selector: 'app-barcode',
  templateUrl: './barcode.component.html',
  styleUrls: ['./barcode.component.scss'],
})
export class BarcodeComponent implements OnInit {
  constructor() { }
  ngOnInit(): void { 
    this.modelDate=this.allowedFormats;
  }
  modelDate: any;

  scannerEnabled = true;
  allowedFormats = [BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX /*, ...*/];
  torch = false;
  onTorchCompatible($event): void {
    // console.log($event);
    // this.modelDate = $event
  }
  camerasFoundHandler($event): void {
    // console.log($event);
    // this.modelDate = $event
  }
  camerasNotFoundHandler($event): void {
    // console.log($event);
    // this.modelDate = $event
  }
  scanSuccessHandler($event): void {
    console.log($event);
    this.modelDate = $event
  }
  scanErrorHandler($event): void {
    // console.log($event);
    // this.modelDate = $event
  }
  scanFailureHandler($event): void {
    // console.log($event);
    // this.modelDate = $event
  }
  scanCompleteHandler($event): void {
    // console.log($event);
    // this.modelDate = $event
  }
  
}
