import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input-int',
  templateUrl: './int.component.html',
  styleUrls: ['./int.component.scss']
})
export class IntComponent implements OnInit {

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
