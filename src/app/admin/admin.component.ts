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
  currentReading: Reading;//reading being shown in current tab
  unusedPractices = [];//unused practices for the current reading

  constructor(
    //private _location:Location,
    private practiceService: PracticeService,
    private readingService: ReadingService) {
  }

  ngOnInit() {
    this.date = new Date();
    // FIXME hardcoded readings; assumes there is at least one reading...FIX!!!
    this.readingService.getTodaysReadings().then(
      (readings) => {
        this.readings = readings;
        var reading = this.readings[0];
        this.currentReading = reading;
        this.fetchUnusedPractices(reading);
      }
    );
    this.practiceService.getPractices().then(
      (practices) => {
        this.practices = practices;
      }
    );

  }

  updateTab(reading){
    this.currentReading = reading;
    this.fetchUnusedPractices(reading);
  }

  fetchUnusedPractices(reading){
    this.unusedPractices = [];
    var alreadyInUse: boolean;
    for (var practice of this.practices) {
      alreadyInUse = false;
      for (var usedPractice of reading.practices) {
        if (usedPractice.id === practice.id) {
          alreadyInUse = true;
        }
      }
      if (!alreadyInUse) {
        this.unusedPractices.push(practice);
      }
    }
    console.log(this.unusedPractices);
  }

  isActive(reading){
    if(reading.id == this.currentReading.id) {
      return true;
    }
    return false;
  }

  noAdvice(practice){
    if(practice.advice=='') {
      return true;
    }
    return false;
  }

}
