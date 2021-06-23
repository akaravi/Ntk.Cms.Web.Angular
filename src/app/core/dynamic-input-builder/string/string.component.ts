import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input-string',
  templateUrl: './string.component.html',
  styleUrls: ['./string.component.scss']
})
export class StringComponent implements OnInit {

  constructor() { }
  @Input()
  set model(value: string) {
    this.privateModelDate = value;
  }
  @Output() modelChange: EventEmitter<string> = new EventEmitter<string>();
  private privateModelDate = '';
  get modelDate(): string {
    return this.privateModelDate;
  }
  set modelDate(value: string) {
    this.privateModelDate = value;
    this.modelChange.emit(value);
  }

  ngOnInit(): void {
  }

}
