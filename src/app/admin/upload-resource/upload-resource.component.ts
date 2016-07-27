import { Component, OnInit, DoCheck } from '@angular/core';
//import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass, NgStyle} from '@angular/common';
import {FILE_UPLOAD_DIRECTIVES, FileUploader} from 'ng2-file-upload';

import {
  FORM_DIRECTIVES,
  REACTIVE_FORM_DIRECTIVES,
  FormBuilder,
  FormGroup,
  // Validators, // not currently being used, but could be used to make a field required
  AbstractControl
} from '@angular/forms';

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
    //NgClass,
    //NgStyle,
    //CORE_DIRECTIVES,
    FORM_DIRECTIVES,
    REACTIVE_FORM_DIRECTIVES]
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

  practiceUpdateForm: FormGroup;
  practiceText: AbstractControl;

  constructor(
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    //this.practiceUpdateForm = this.formBuilder.group({
    //  'practiceText': [this.practice.advice]
    //});
    // set form control as an instance variable for convenience
    // (see: http://blog.ng-book.com/the-ultimate-guide-to-forms-in-angular-2/)
    // if don't go this route, would use things like this.practiceUpdateForm.value.practiceText, etc.
    //this.practiceText = this.practiceUpdateForm.controls['practiceText'];
  }

  ngDoCheck(){
    if (this.uploader.queue) {
      this.numFiles = this.uploader.queue.length;
    }

  }

  onClick(){
    console.log(this.uploader);
  }

  onSubmit(): void {
    //this.editModeOn = false;
    // now propagate the change up to edit-reading-resources....
    //this.updatePracticeItemBindingService.updatePractice(
    //  {
    //    practice: this.practice,
    //    advice: this.practiceText.value
    //  }
    //);
  }


}

