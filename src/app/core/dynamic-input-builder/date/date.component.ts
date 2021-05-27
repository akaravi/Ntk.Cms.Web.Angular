import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss']
})
export class DateComponent implements OnInit {

  constructor() { }
  @Input() model: Date;
  @Output() modelChange: EventEmitter<Date> = new EventEmitter<Date>();
  ngOnInit(): void {
  }

}
