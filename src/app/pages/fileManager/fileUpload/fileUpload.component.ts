import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
} from '@angular/core';
import { FlowDirective, Transfer } from '@flowjs/ngx-flow';
import { ErrorExceptionResult, FileUploadedModel } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { ComponentOptionFileUploadModel } from 'src/app/core/cmsComponentModels/files/componentOptionFileUploadModel';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-file-upload',
  templateUrl: './fileUpload.component.html',
  styleUrls: ['./fileUpload.component.scss']
})

export class FileUploadComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private cd: ChangeDetectorRef) {}
  @Input()
  set options(model: ComponentOptionFileUploadModel) {
    this.optionData = model;
  }
  get options(): ComponentOptionFileUploadModel {
    return this.optionData;
  }
  private optionData: ComponentOptionFileUploadModel = new ComponentOptionFileUploadModel();

  @ViewChild('flow', { static: false })
  flow: FlowDirective;
  autoUploadSubscription: Subscription;
  flowOption: flowjs.FlowOptions;
  uploadViewImage = false;
  ngOnInit(): void {
    this.flowOption = {
      target: environment.cmsServerConfig.configRouteUploadFileContent,
      // tslint:disable-next-line: typedef
      query(flowFile, flowChunk) {
        if (flowFile.myparams) {
          return flowFile.myparams;
        }
        // console.log(flowChunk.offset)

        // generate some values
        flowFile.myparams = {
          Filename: flowChunk.fileObj.name,
          Identifier: flowChunk.fileObj.uniqueIdentifier,
          TotalChunks: flowChunk.fileObj.chunks.length,
        };
        return flowFile.myparams;
      },
      allowDuplicateUploads: false,
    };
  }

  ngAfterViewInit(): void {
    this.autoUploadSubscription = this.flow.events$.subscribe((event) => {
      switch (event.type) {
        case 'filesSubmitted':
          return this.flow.upload();
        case 'fileSuccess':
          return this.fileSuccess(event);
        case 'newFlowJsInstance':
          return this.cd.detectChanges();
      }
    });
  }
  fileSuccess(event: any): void {
    if (event && event.event) {
      if (
        this.optionData &&
        this.optionData.onActions &&
        this.optionData.onActions.onActionSelect
      ) {
        const model = {
          fileName: event.event[0].name,
          fileKey: event.event[1],
        };
        debugger
        const retUpload=JSON.parse( event.event[1]) as ErrorExceptionResult<FileUploadedModel>;
        retUpload.Item.FileName=event.event[0].name
        this.optionData.onActions.onActionSelect(retUpload);
        this.optionData.data = { Select: retUpload };
      }
    }
  }
  trackTransfer(transfer: Transfer): string {
    return transfer.id;
  }

  ngOnDestroy(): void {
    this.autoUploadSubscription.unsubscribe();
  }
}
