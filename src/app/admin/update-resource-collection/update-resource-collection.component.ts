import { Component, OnInit, Input, OnDestroy } from '@angular/core';
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
import { UpdateResourceItemComponent } from '../update-resource-item';
import { UploadResourceComponent } from '../upload-resource';


import {MaterializeDirective} from "angular2-materialize";

declare var $: any; // for using jQuery within this angular component

@Component({
  moduleId: module.id,
  selector: 'app-update-resource-collection',
  templateUrl: 'update-resource-collection.component.html',
  styleUrls: ['update-resource-collection.component.css'],
  directives: [
    MaterializeDirective,
    UpdateResourceItemComponent,
    REACTIVE_FORM_DIRECTIVES,
    UploadResourceComponent],
})
export class UpdateResourceCollectionComponent implements OnInit {

  @Input() resourceCollection: ResourceCollection;
  @Input() resourcePath: string;

  //useful resources:
  //  https://scotch.io/tutorials/using-angular-2s-model-driven-forms-with-formgroup-and-formcontrol
  //  https://angular.io/docs/ts/latest/cookbook/dynamic-form.html
  // *https://scotch.io/tutorials/how-to-build-nested-model-driven-forms-in-angular-2
  public resourceCollectionForm: FormGroup; // our model driven form
  public submitted: boolean; // keep track of whether form is submitted

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.resourceCollectionForm = this.formBuilder.group({
      title: ['', [<any>Validators.required]],
      description: ['', [<any>Validators.required]],
      resources: this.formBuilder.array(
        this.initResourceArray(this.resourceCollection.resources)),
    });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    //this.subscription.unsubscribe(); //not actually using the subscription here....
  }

  initResourceArray(resources: Resource[]) {
    let resourceArray = [];
    for (let resource of resources) {
      resourceArray.push(this.initResource(resource));
    }
    return resourceArray;
  }

  initResource(resourceInfo: Resource) {
    // initialize our address
    return this.formBuilder.group({
      id: [resourceInfo.id],
      caption: [resourceInfo.caption, Validators.required],
      type: [resourceInfo.type, Validators.required],// 'image', 'video', etc.
      fileName: [resourceInfo.fileName, Validators.required],
      copyrightInfo: [resourceInfo.copyrightInfo]
    });
  }

  onModalFinished(modalID: string){
    // Note: must include the following declaration (above) in component:
    //          declare var $: any;
    console.log('about to close the modal....');
    console.log('#'+modalID);
    $('#'+modalID).closeModal();
  }
  
}
