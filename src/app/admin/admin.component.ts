import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import {Location} from '@angular/common';

import {MaterializeDirective} from "angular2-materialize";

import { PracticeService } from '../shared/services/practice.service';
import { Practice } from '../shared/models/practice.model';
import { ReadingService } from '../shared/services/reading.service';
import { Reading } from '../shared/models/reading.model';

// useful resource for using Materialize components that require js:
// https://github.com/InfomediaLtd/angular2-materialize/tree/master/app/components

@Component({
  moduleId: module.id,
  selector: 'app-admin',
  templateUrl: 'admin.component.html',
  styleUrls: ['admin.component.css'],
  providers: [ReadingService, PracticeService],
  directives: [ROUTER_DIRECTIVES, MaterializeDirective],

})
export class AdminComponent implements OnInit {

  private routeNames = ["Buttons", "Collapsible", "Dialogs", "Dropdown", "Forms", "Tabs", "TabsRouting", "DatePicker", "ModelBindings"];

  date: Date;
  readings: Reading[] = [];
  practices: Practice[] = [];

  constructor(
    private _location:Location,
    private practiceService: PracticeService,
    private readingService: ReadingService) {
  }

  ngOnInit() {
    this.date = new Date();
    // FIXME hardcoded readings
    this.readingService.getTodaysReadings().then(
      (readings) => {
        this.readings = readings;
      }
    );
    this.practiceService.getPractices().then(
      (practices) => {
        this.practices = practices;
      }
    );

  }

}
