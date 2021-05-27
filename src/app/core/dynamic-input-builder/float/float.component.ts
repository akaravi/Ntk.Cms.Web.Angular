import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input-float',
  templateUrl: './float.component.html',
  styleUrls: ['./float.component.scss']
})
export class FloatComponent implements OnInit {

  constructor() { }
  @Input() model: number;
  @Output() modelChange: EventEmitter<number> = new EventEmitter<number>();
  ngOnInit(): void {
  }

}
