import { Component, OnInit } from '@angular/core';
import { TreeModel } from 'ntk-cms-filemanager';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-file-content-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss']
})
export class FileContentExplorerComponent implements OnInit {

  constructor() {
    this.fileManagerTree = new TreeModel();
    this.fileManagerTree.config.baseUploadURL = environment.cmsServerConfig.configRouteUploadFileContent;
  }
  appLanguage = 'fa';
  fileManagerOpenForm = true;
  fileManagerTree: TreeModel;
  selectFileType = [];
  ngOnInit(): void {
  }
}
