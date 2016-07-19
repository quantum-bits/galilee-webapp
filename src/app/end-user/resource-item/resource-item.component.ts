import { Component, OnInit, Input } from '@angular/core';

import {MaterializeDirective} from "angular2-materialize";


@Component({
  moduleId: module.id,
  selector: 'app-resource-item',
  templateUrl: 'resource-item.component.html',
  styleUrls: ['resource-item.component.css'],
  directives: [MaterializeDirective],
})
export class ResourceItemComponent implements OnInit {

  @Input() reading: any;
  @Input() resource: any;
  @Input() resourcePath;

  constructor() {}

  ngOnInit() {
  }

}
