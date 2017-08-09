import { Component, OnInit } from '@angular/core';

import { FileUploader } from 'ng2-file-upload';

const URL = '/api/resources';


// taken from: http://valor-software.com/ng2-file-upload/
// see: http://stackoverflow.com/questions/37625274/implementing-ng2-file-upload
//      ...for some helpful comments

@Component({
  selector: 'app-upload-resource',
  templateUrl: './upload-resource.component.html',
  styleUrls: ['./upload-resource.component.scss']
})
export class UploadResourceComponent implements OnInit {


  public uploader: FileUploader = new FileUploader({url: URL});
  public hasBaseDropZoneOver: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  // TODO: Remove me.
  dumpUploaderDetails() {
    console.log(this.uploader);
  }

  showQueue() {
    return this.uploader.queue.length > 0;
  }


}
