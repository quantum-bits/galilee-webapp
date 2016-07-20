import { Component, OnInit, Input } from '@angular/core';

import {MaterializeDirective} from "angular2-materialize";
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';

@Component({
  moduleId: module.id,
  selector: 'app-resource-item',
  templateUrl: 'resource-item.component.html',
  styleUrls: ['resource-item.component.css'],
  pipes: [TruncatePipe],
  directives: [MaterializeDirective],
})
export class ResourceItemComponent implements OnInit {

  // useful info on pipes: http://youknowriad.github.io/angular2-cookbooks/pipe.html

  // WORKING HERE: need to refactor the resource stuff a bit; 'image' (etc.) should be a type or something....


  @Input() reading: any;
  @Input() resource: any;
  @Input() resourcePath;

  constructor() {}

  ngOnInit() {
  }

}
