import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input-textarea',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss']
})
export class TextAreaComponent implements OnInit {

  constructor() { }
  @Input() model: string;
  @Output() modelChange: EventEmitter<string> = new EventEmitter<string>();
  ngOnInit(): void {
  }

}
