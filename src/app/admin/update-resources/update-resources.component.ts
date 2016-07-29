import { Component, OnInit, Input, ViewChild, ElementRef, Renderer } from '@angular/core';

import {ResourceService} from '../../shared/services/resource.service';
//import { UpdateResourceItemComponent } from '../update-resource-item';
import { UpdateResourceCollectionComponent } from '../update-resource-collection';
import { UploadResourceComponent } from '../upload-resource';

import { Resource } from '../../shared/interfaces/resource.interface';
import { ResourceCollection } from '../../shared/interfaces/resource-collection.interface';

import {MaterializeDirective} from "angular2-materialize";
import {Dragula, DragulaService} from 'ng2-dragula/ng2-dragula';

@Component({
  moduleId: module.id,
  selector: 'app-update-resources',
  templateUrl: 'update-resources.component.html',
  styleUrls: ['update-resources.component.css'],
  providers: [DragulaService],
  directives: [
    MaterializeDirective,
    UpdateResourceCollectionComponent,
    UploadResourceComponent,
    Dragula
  ],
})
export class UpdateResourcesComponent implements OnInit {

  @Input() resourceCollectionsThisReading;
  @Input() changeTracker;
  @ViewChild('myModalResourcePicker') input: ElementRef;

  private initialResourceCollection: ResourceCollection = {
    title: 'try this title for fun!',
    description: 'this is a description',
    resources: []
  }


  resourceTypes = [];
  resourceDropDown = [];
  resourcePath: string;

  constructor(private resourceService:ResourceService,
              private renderer: Renderer,
              private dragulaService: DragulaService) {
    dragulaService.drag.subscribe((value) => {
      console.log(`drag: ${value[0]}`);
      this.onDrag(value.slice(1));
    });
    dragulaService.drop.subscribe((value) => {
      console.log(`drop: ${value[0]}`);
      this.onDrop(value.slice(1));
    });
    dragulaService.over.subscribe((value) => {
      console.log(`over: ${value[0]}`);
      this.onOver(value.slice(1));
    });
    dragulaService.out.subscribe((value) => {
      console.log(`out: ${value[0]}`);
      console.log(value);
      this.onOut(value.slice(1));
    });
    dragulaService.dropModel.subscribe((value) => {
      this.onDropModel(value.slice(1));
    });
    dragulaService.removeModel.subscribe((value) => {
      this.onRemoveModel(value.slice(1));
    });
  }

  ngOnInit() {
    this.resourceService.getResources().subscribe(
      resources => {
        this.resourceTypes = resources;
        console.log(this.resourceTypes);
        //this.buttonDisabled = this.noUnusedPractices();
      },
      err => console.log("ERROR", err),
      () => console.log("Resource Types fetched"));
    this.resourceService.getResourcePath().subscribe(
      path => {
        this.resourcePath = path;
        console.log(this.resourcePath);
        //this.buttonDisabled = this.noUnusedPractices();
      },
      err => console.log("ERROR", err),
      () => console.log("Resource path fetched"));


    console.log(this.resourceCollectionsThisReading);
  }

  addResource(resource) {
    this.renderer.invokeElementMethod(this.input.nativeElement,
      'click');
  }

  private onDrag(args) {
    let [e, el] = args;
    // do something
  }

  private onDrop(args) {
    let [e, el] = args;
    // do something
  }

  private onOver(args) {
    let [e, el, container] = args;
    // do something
  }

  private onOut(args) {
    let [e, el, container] = args;
    // do something
  }

  private onDropModel(args) {
    let [el, target, source] = args;
    console.log('dropped!');
    console.log(this.resourceCollectionsThisReading);
    // do something else
  }

  private onRemoveModel(args) {
    let [el, source] = args;
    // do something else
  }
  
}
