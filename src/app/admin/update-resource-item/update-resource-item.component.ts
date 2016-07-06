import { Component, OnInit, Input } from '@angular/core';

import {UpdateResourceItemBindingService} from '../update-resource-item-binding.service';

import {MaterializeDirective} from "angular2-materialize";

@Component({
  moduleId: module.id,
  selector: 'app-update-resource-item',
  templateUrl: 'update-resource-item.component.html',
  styleUrls: ['update-resource-item.component.css'],
  directives: [MaterializeDirective],
})
export class UpdateResourceItemComponent implements OnInit {

  @Input() resource;
  @Input() resourcePath;
  
  constructor() {}

  ngOnInit() {
  }

}
