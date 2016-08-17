import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import {UpdateResourceItemBindingService} from '../update-resource-item-binding.service';

//import {MaterializeDirective} from "angular2-materialize";

@Component({
  selector: 'app-update-resource-item',
  templateUrl: 'update-resource-item.component.html',
  styleUrls: ['update-resource-item.component.css'],
  directives: [
    //MaterializeDirective
  ],
})
export class UpdateResourceItemComponent implements OnInit, OnDestroy {

  @Input() resource;
  @Input() resourcePath;

  constructor() {}

  ngOnInit() {
  }


  ngOnDestroy() {
    // prevent memory leak when component destroyed
    //this.subscription.unsubscribe(); //not actually using the subscription here....
  }


}
