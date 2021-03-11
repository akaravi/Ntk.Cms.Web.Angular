import { Component, OnInit } from '@angular/core';
import { TreeModel } from 'ntk-cms-filemanager';

@Component({
  selector: 'app-file-content-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss']
})
export class FileContentExplorerComponent implements OnInit {

  constructor() {
    this.fileManagerTree = new TreeModel();
  }
  appLanguage = 'fa';
  fileManagerOpenForm = true;
  fileManagerTree: TreeModel;
  selectFileType = [];
  ngOnInit(): void {
  }
}
