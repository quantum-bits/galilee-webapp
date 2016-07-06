import { Component, OnInit, Input } from '@angular/core';

import {ResourceService} from '../../shared/services/resource.service';

import {MaterializeDirective} from "angular2-materialize";

@Component({
  moduleId: module.id,
  selector: 'app-update-resources',
  templateUrl: 'update-resources.component.html',
  styleUrls: ['update-resources.component.css'],
  directives: [MaterializeDirective],
})
export class UpdateResourcesComponent implements OnInit {

  @Input() resourcesThisReading;
  @Input() changeTracker;

  resources = [];
  resourceDropDown = [];

  constructor(private resourceService:ResourceService) {}

  ngOnInit() {
    this.resourceService.getResources().subscribe(
      resources => {
        this.resources = resources;
        console.log(resources);
        //this.buttonDisabled = this.noUnusedPractices();
      },
      err => console.log("ERROR", err),
      () => console.log("Resources fetched"));
  }


  addResource(resource) {

  }

}
