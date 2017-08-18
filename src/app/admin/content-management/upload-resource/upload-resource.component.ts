import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import {AuthHttp} from 'angular2-jwt';
import { FileUploader } from 'ng2-file-upload';

//import {MaterializeAction} from "angular2-materialize";
import {MaterializeDirective, MaterializeAction} from "angular2-materialize";

import {AuthenticationService} from "../../../authentication/authentication.service";
import {JWT_TOKEN_KEY} from '../../../shared/constants';

const URL = '/api/resources/uploads';

declare var Materialize:any;

/**
 * taken from: http://valor-software.com/ng2-file-upload/
 * see: http://stackoverflow.com/questions/37625274/implementing-ng2-file-upload
 *      ...for some helpful comments
 *
 * Note: We only allow for a single file upload (the package allows for multiple files to be uploaded);
 *       thus, we are always working with the zeroth element in the queue.
 *
 */

@Component({
  selector: 'app-upload-resource',
  templateUrl: './upload-resource.component.html',
  styleUrls: ['./upload-resource.component.scss']
})
export class UploadResourceComponent implements OnInit {

  @Output() onUploaded = new EventEmitter<string>(); //UUID of uploaded file
  @Output() onDelete = new EventEmitter<string>(); //UUID of file that was uploaded but should now be deleted

  tapTargetActions = new EventEmitter<MaterializeAction>();

  public uploader: FileUploader = new FileUploader({url: URL, authToken: this.authenticationService.getToken()});

  public hasBaseDropZoneOver: boolean = false;

  public errorMessage: string = null;
  public fileId: string = null;

  constructor(private authHttp: AuthHttp,
              private authenticationService: AuthenticationService) {
    //see: https://github.com/valor-software/ng2-file-upload/issues/26
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      let responsePath = JSON.parse(response);
      console.log(response, responsePath);// the url will be in the response
      // see: https://github.com/InfomediaLtd/angular2-materialize/issues/76
      if (responsePath.error) {
        Materialize.toast('Sorry, there was an error...', 2000);
        this.errorMessage = responsePath.message;
        this.uploader.queue[0].remove();
      } else {
        if (responsePath.fileId) {
          Materialize.toast('File uploaded successfully', 2000, 'rounded');
          this.fileId = responsePath.fileId;
          this.broadcastUploadSuccess();
        } else {
          // this shouldn't happen, but just in case....
          Materialize.toast('Sorry, there was an error...', 2000);
          this.errorMessage = 'unknown error';
          this.uploader.queue[0].remove();
        }
      }
    };
  }

  ngOnInit() {
    console.log('upload-resource on init');
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  // TODO: Remove me.
  dumpUploaderDetails() {
    console.log(this.uploader);
  }

  noUploadItem() {
    return this.uploader.queue.length === 0;
  }

  itemReadyForUpload() {
    return this.uploader.queue.length === 1 && (!this.uploader.queue[0].isUploaded);
  }

  itemUploadedSuccessfully() {
    return this.uploader.queue.length === 1 && this.uploader.queue[0].isUploaded && (!this.uploader.queue[0].isError);
  }

  itemUploading() {
    return this.uploader.queue.length === 1 && this.uploader.queue[0].isUploading;
  }

  uploadFile() {
    // upload file; it is the zeroth element in the queue, since we only allow for one file to be uploaded
    console.log('upload file...!');
    this.uploader.queue[0].upload();
  }

  remove() {
    // remove file from upload queue
    console.log('remove file from queue...!');
    this.uploader.queue[0].remove();
  }

  cancelUpload() {
    // remove file from upload queue
    console.log('cancel file upload');
    this.uploader.cancelAll();
  }

  broadcastUploadSuccess() {
    this.onUploaded.emit(this.fileId);
  }

  deleteFile() {
    // delete file from server and remove from queue
    console.log('delete file');
    // TODO: hit the api to delete the resource
    this.uploader.queue[0].remove(); // remove it from the queue
    this.onDelete.emit(this.fileId); // emit message so that parent component deletes UUID from the form
  }

  clearErrorMessage() {
    this.errorMessage = null;
  }

}
