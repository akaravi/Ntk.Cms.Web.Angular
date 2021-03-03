import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/core/services/layout.service';

@Component({
  selector: 'app-one',
  templateUrl: './one.component.html',
  styleUrls: ['./one.component.scss']
})
export class DashboardOneComponent implements OnInit {
  demo: string;

  constructor(private layout: LayoutService) { }

  ngOnInit(): void {
    this.demo = this.layout.getProp('demo');

  }

}
