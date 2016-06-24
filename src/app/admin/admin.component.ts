import { Component, OnInit, EventEmitter } from '@angular/core';
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
  inputs: ['model: textInput'],
  outputs: ['textInputChange'],

})
export class AdminComponent implements OnInit {

  private routeNames = ["Buttons", "Collapsible", "Dialogs", "Dropdown", "Forms", "Tabs", "TabsRouting", "DatePicker", "ModelBindings"];

  date: Date;
  readings: Reading[] = [];
  practices: Practice[] = [];
  currentReading: any;//reading being shown in current tab
  unusedPractices = [];//unused practices for the current reading
  currentPractice: any = null;

  textInput: string = '';
  textInputChange = new EventEmitter();

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
        this.practiceService.getPractices().then(
          (practices) => {
            this.practices = practices;
            this.fetchUnusedPractices();
          }
        );
      }
    );
  }

  updateTab(reading){
    this.currentReading = reading;
    this.fetchUnusedPractices();
  }

  fetchUnusedPractices(){
    this.unusedPractices = [];
    var alreadyInUse: boolean;
    for (var practice of this.practices) {
      alreadyInUse = false;
      for (var usedPractice of this.currentReading.practices) {
        if (usedPractice.id === practice.id) {
          alreadyInUse = true;
        }
      }
      if (!alreadyInUse) {
        this.unusedPractices.push(practice);
      }
    }
  }

  setCurrentPractice(practice){
    this.currentPractice = practice;
  }

  // the following is probably overkill...it tracks every new character that is typed
  updateTextInput(newValue) {
    this.textInput = newValue;
    this.textInputChange.emit(newValue);
    console.log(this.textInput);
  }

  addPracticeToCurrentReading(){
    this.currentReading.practices.push(
      {
        id: this.currentPractice.id,
        title: this.currentPractice.title,
        advice: this.textInput
      }
    );
    // clean up for modal exit
    this.textInput = '';
    this.currentPractice = null;
    this.fetchUnusedPractices();
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
