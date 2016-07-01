import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

import {MaterializeDirective} from "angular2-materialize";

@Component({
  moduleId: module.id,
  selector: 'app-update-practice-item',
  templateUrl: 'update-practice-item.component.html',
  styleUrls: ['update-practice-item.component.css'],
  directives: [MaterializeDirective]
})
export class UpdatePracticeItemComponent implements OnInit {

  @Input() practice;

  constructor() {}

  ngOnInit() {
    console.log(this.practice);
  }


  // true if there is not currently any advice listed for this practice for this reading
  noAdvice(practice) {
    if (practice.advice == '') {
      return true;
    }
    return false;
  }



}
