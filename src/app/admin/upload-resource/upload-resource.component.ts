import { Component, OnInit, DoCheck, Input } from '@angular/core';
//import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass, NgStyle} from '@angular/common';
import {FILE_UPLOAD_DIRECTIVES, FileUploader} from 'ng2-file-upload';
import {MaterializeDirective} from "angular2-materialize";

import {
  FORM_DIRECTIVES,
  REACTIVE_FORM_DIRECTIVES,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators, // used to make a field required
  FormControl
} from '@angular/forms';

import { Resource } from '../../shared/interfaces/resource.interface';
import { ResourceCollection } from '../../shared/interfaces/resource-collection.interface';

import { InputWakeUp } from '../../shared/directives/input-wake-up.directive';

const URL = '/api/';

declare var $: any; // for using jQuery within this angular component

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
    REACTIVE_FORM_DIRECTIVES,
    MaterializeDirective,
    InputWakeUp]
})
export class UploadResourceComponent implements OnInit, DoCheck {

  //useful resources for forms, nested forms:
  //  https://scotch.io/tutorials/using-angular-2s-model-driven-forms-with-formgroup-and-formcontrol
  //  https://angular.io/docs/ts/latest/cookbook/dynamic-form.html
  // *https://scotch.io/tutorials/how-to-build-nested-model-driven-forms-in-angular-2

  // WORKING HERE....next steps:
  // - use event emitter to back-propagate stuff

  public uploader:FileUploader = new FileUploader({url: URL});
  public hasBaseDropZoneOver:boolean = false;
  public hasAnotherDropZoneOver:boolean = false;

  private numFiles = 0;

  @Input() resourceCollection: ResourceCollection;
  @Input() resourcePath: string;

  public resourceCollectionForm: FormGroup; // our model driven form
  public submitted: boolean; // keep track of whether form is submitted


  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }

  constructor(
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.resourceCollectionForm = this.formBuilder.group({
      title: [this.resourceCollection.title, [<any>Validators.required]],
      description: [this.resourceCollection.description, [<any>Validators.required]],
      resources: this.formBuilder.array(
        this.initResourceArray(this.resourceCollection.resources)),
    });
  }

  ngDoCheck(){
    if (this.uploader.queue) {
      this.numFiles = this.uploader.queue.length;
    }
  }


  onClick(){
    console.log(this.uploader);
  }

  uploadItem(i: number) {
    this.uploader.queue[i].upload();//this is a fileUploader method
    // >>>should somehow wait for success of the upload<<<
    let resource: Resource;
    resource = {
      caption:'',
      type:'image',
      fileName:this.uploader.queue[i]._file.name,
      copyrightInfo:'...and a copyright thing'
    }
    this.addResource(resource);
    console.log(this.resourceCollectionForm);
  }


  initResourceArray(resources: Resource[]) {
    console.log(resources);
    let resourceArray = [];
    for (let resource of resources) {
      resourceArray.push(this.initResource(resource));
    }
    return resourceArray;
  }

  initResource(resourceInfo: Resource) {
    // initialize our resource
    console.log('about to initialize new resource');
    console.log(resourceInfo);
    return this.formBuilder.group({
      caption: [resourceInfo.caption, Validators.required],
      type: [resourceInfo.type, Validators.required],// 'image', 'video', etc.
      fileName: [resourceInfo.fileName, Validators.required],
      copyrightInfo: [resourceInfo.copyrightInfo]
    });
  }

  addResource(resource: Resource) {
    // add resource to the list
    const control = <FormArray>this.resourceCollectionForm.controls['resources'];
    control.push(this.initResource(resource));
  }

  removeResource(i: number) {
    // remove address from the list
    const control = <FormArray>this.resourceCollectionForm.controls['resources'];
    control.removeAt(i);
  }

  save(model: ResourceCollection) {
    this.submitted = true; // set form submit to true

    // check if model is valid
    // if valid, call API to save customer
    console.log(model);
  }

  /*
  showCaptionErrorMessage(i: number){
    var showMessage=false;
    if (!this.resourceCollectionForm.controls.resources.controls[i].controls.caption.valid){
      showMessage=true;
    }
    return showMessage;
  }
  */

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

