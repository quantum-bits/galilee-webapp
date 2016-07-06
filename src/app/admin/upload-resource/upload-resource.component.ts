import { Component, OnInit } from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass, NgStyle} from '@angular/common';
import {FILE_UPLOAD_DIRECTIVES, FileUploader} from 'ng2-file-upload';//'app./../node_modules/ng2-file-upload';

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
export class UploadResourceComponent implements OnInit {

  constructor() {}

  ngOnInit() {
  }

}
