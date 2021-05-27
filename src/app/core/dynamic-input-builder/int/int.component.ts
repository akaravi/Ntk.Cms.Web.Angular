import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input-int',
  templateUrl: './int.component.html',
  styleUrls: ['./int.component.scss']
})
export class IntComponent implements OnInit {

  constructor() { }
  @Input() model: number;
  @Output() modelChange: EventEmitter<number> = new EventEmitter<number>();
  ngOnInit(): void {
  }

}
