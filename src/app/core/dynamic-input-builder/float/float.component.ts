import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input-float',
  templateUrl: './float.component.html',
  styleUrls: ['./float.component.scss']
})
export class FloatComponent implements OnInit {

  constructor() { }
  @Input()
  set model(value: number) {
    this.privateModelDate = value;
  }
  @Output() modelChange: EventEmitter<number> = new EventEmitter<number>();
  private privateModelDate: number;
  get modelDate(): number {
    return this.privateModelDate;
  }
  set modelDate(value: number) {
    this.privateModelDate = value;
    this.modelChange.emit(value);
  }
  ngOnInit(): void {
  }


}
