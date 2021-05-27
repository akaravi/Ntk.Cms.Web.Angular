import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input-string',
  templateUrl: './string.component.html',
  styleUrls: ['./string.component.scss']
})
export class StringComponent implements OnInit {

  constructor() { }
  @Input() model: string;
  @Output() modelChange: EventEmitter<string> = new EventEmitter<string>();
  ngOnInit(): void {
  }

}
