import { Component, OnInit } from '@angular/core';
// import {TreeModel, NodeInterface, ConfigInterface, DownloadModeEnum} from 'ng6-file-man';
import {TreeModel, NodeInterface, ConfigInterface, DownloadModeEnum } from 'ntk-cms-filemanager';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  tree: TreeModel;
  node: NodeInterface;
  appLanguage = 'sk';

  constructor() {
    const treeConfig: ConfigInterface = {
      baseURL: 'http://localhost:8080/',
      api: {
        listFile: 'api/list',
        uploadFile: 'api/upload',
        downloadFile: 'api/download',
        deleteFile: 'api/remove',
        createFolder: 'api/directory',
        renameFile: 'api/rename',
        searchFiles: 'api/search'
      },
      options: {
        allowFolderDownload: DownloadModeEnum.DOWNLOAD_DISABLED,
        showFilesInsideTree: false
      }
    };

    this.tree = new TreeModel(treeConfig);
    this.node = this.tree.nodes;
  }
  ngOnInit(): void {
  }

  // noinspection JSUnusedLocalSymbols
  itemSelected(event: any) {
    console.log(event);
  }
}
