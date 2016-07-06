import { Component, OnInit, Input, ViewChild, ElementRef, Renderer } from '@angular/core';

import {ResourceService} from '../../shared/services/resource.service';
import { UpdateResourceItemComponent } from '../update-resource-item';
import { UploadResourceComponent } from '../upload-resource';

import {MaterializeDirective} from "angular2-materialize";

@Component({
  moduleId: module.id,
  selector: 'app-update-resources',
  templateUrl: 'update-resources.component.html',
  styleUrls: ['update-resources.component.css'],
  directives: [MaterializeDirective, UpdateResourceItemComponent, UploadResourceComponent],
})
export class UpdateResourcesComponent implements OnInit {

  @Input() resourcesThisReading;
  @Input() changeTracker;
  @ViewChild('myModalResourcePicker') input: ElementRef;

  resources = [];
  resourceDropDown = [];
  resourcePath: string;

  constructor(private resourceService:ResourceService,
              private renderer: Renderer) {}

  ngOnInit() {
    this.resourceService.getResources().subscribe(
      resources => {
        this.resources = resources;
        console.log(resources);
        //this.buttonDisabled = this.noUnusedPractices();
      },
      err => console.log("ERROR", err),
      () => console.log("Resources fetched"));
    this.resourceService.getResourcePath().subscribe(
      path => {
        this.resourcePath = path;
        console.log(this.resourcePath);
        //this.buttonDisabled = this.noUnusedPractices();
      },
      err => console.log("ERROR", err),
      () => console.log("Resource path fetched"));
  }


  addResource(resource) {
    this.renderer.invokeElementMethod(this.input.nativeElement,
      'click');
  }

}
