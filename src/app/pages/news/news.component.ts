import {Component, OnInit} from '@angular/core';
import {Map} from 'leaflet';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }
  // private map: Map;
  // private zoom: number;

  // receiveMap(map: Map) {
  //   this.map = map;
  // }

  // receiveZoom(zoom: number) {
  //   this.zoom = zoom;
  // }
}
