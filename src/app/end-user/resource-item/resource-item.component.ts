import { Component, OnInit, Input } from '@angular/core';
import {Resource} from '../../shared/models/resource.model';


@Component({
  selector: 'app-resource-item',
  templateUrl: './resource-item.component.html'
})
export class ResourceItemComponent implements OnInit {

  // useful info on pipes: http://youknowriad.github.io/angular2-cookbooks/pipe.html

  // WORKING HERE: need to refactor the resource stuff a bit; 'image' (etc.) should be a type or something....

  @Input() resource: Resource;

  @Input() reading: any;
  @Input() resourceCollection: any;
  @Input() resourcePath;

  constructor() {}

  ngOnInit() {
  }

}
