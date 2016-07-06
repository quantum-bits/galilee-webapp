import { Component, OnInit, DoCheck } from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass, NgStyle} from '@angular/common';
import {FILE_UPLOAD_DIRECTIVES, FileUploader} from 'ng2-file-upload';


const URL = '/api/';

// taken from: http://valor-software.com/ng2-file-upload/
// see: http://stackoverflow.com/questions/37625274/implementing-ng2-file-upload
//      ...for some helpful comments

@Component({
  moduleId: module.id,
  selector: 'app-upload-resource',
  templateUrl: 'upload-resource.component.html',
  styleUrls: ['upload-resource.component.css'],
  directives: [
    FILE_UPLOAD_DIRECTIVES,
    NgClass,
    NgStyle,
    CORE_DIRECTIVES,
    FORM_DIRECTIVES]
})
export class UploadResourceComponent implements OnInit, DoCheck {

  public uploader:FileUploader = new FileUploader({url: URL});
  public hasBaseDropZoneOver:boolean = false;
  public hasAnotherDropZoneOver:boolean = false;

  private numFiles = 0;

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }

  onClick(){
    console.log(this.uploader);
  }

  constructor() {}

  ngOnInit() {
  }

  ngDoCheck(){
    if (this.uploader.queue) {
      this.numFiles = this.uploader.queue.length;
    }

  }

}
