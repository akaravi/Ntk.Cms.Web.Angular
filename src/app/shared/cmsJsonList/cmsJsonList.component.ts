import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cms-json-list',
  templateUrl: './cmsJsonList.component.html',
  styleUrls: ['./cmsJsonList.component.scss']
})
export class CmsJsonListComponent implements OnInit {

  constructor() { }
  @Input() optionMethod = 1;
  @Input() dataModel: any;
  ngOnInit(): void {
  }

}
