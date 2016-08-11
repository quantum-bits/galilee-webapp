import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Resource } from '../../../shared/models/resource.model';
import { ResourceCollection } from '../../../shared/interfaces/resource-collection.interface';
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
    UploadResourceComponent],
})
export class UpdateResourceCollectionComponent implements OnInit {

  @Input() resourceCollection: ResourceCollection;
  @Input() resourcePath: string;

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    //this.subscription.unsubscribe(); //not actually using the subscription here....
  }

  onModalFinished(modalID: string){
    // Note: must include the following declaration (above) in component:
    //          declare var $: any;
    console.log('about to close the modal....');
    console.log('#'+modalID);
    $('#'+modalID).closeModal();
  }

}
