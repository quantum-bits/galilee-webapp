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
  currentPractice: any = null;//practice that is currently being added/edited in modal(s)

  textInput: string = '';//text area input that will eventually be saved as the "advice" for a practice for a reading

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

  // fetches the practices that are not currently associated with the current reading
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

  // sets the practice that is currently in play (the one being added/edited)
  setCurrentPractice(practiceId){
    for (var practice of this.practices) {
      if (practiceId === practice.id) {
        this.currentPractice = practice;
      }
    }
  }

  // the following is probably overkill...it tracks every new character that is typed
  updateTextInput(newValue) {
    this.textInput = newValue;
    this.textInputChange.emit(newValue);
    console.log(this.textInput);
  }

  // used to add a new practice to this.currentReading or to edit an existing practice
  addPracticeToCurrentReading(){
    var practiceAlreadyInUse = false; // true if this practice is already in use for this reading
    var practiceArrayIndex = null;
    for (let i in this.currentReading.practices){// using for...in so that I can get the index
      if (this.currentPractice.id === this.currentReading.practices[i].id) {
        practiceAlreadyInUse = true;
        practiceArrayIndex = i;
      }
    }
    if ( practiceAlreadyInUse ) { //update the practice and associated advice
      this.currentReading.practices[practiceArrayIndex] =
      {
        id: this.currentPractice.id,
        title: this.currentPractice.title,
        advice: this.textInput
      }
    } else { //add the new practice and associated advice
      this.currentReading.practices.push(
        {
          id: this.currentPractice.id,
          title: this.currentPractice.title,
          advice: this.textInput
        }
      );
    }
    // clean up for modal exit
    this.cleanUp();
  }

  cancelReadingEdits(){
    // clean up for modal exit
    this.cleanUp();
  }

  // called upon exiting modal; resets various things....
  cleanUp(){
    this.textInput = '';
    this.currentPractice = null;
    this.fetchUnusedPractices();
  }

  // performs some initialization so that this.currentReading.practices[i] can be edited
  initializeEditAdviceModal(practiceWithAdvice) {
    this.setCurrentPractice(practiceWithAdvice.id);
    this.textInput=practiceWithAdvice.advice;
  }

  // true if the reading passed in is the current reading being shown in the tab
  isActive(reading){
    if(reading.id == this.currentReading.id) {
      return true;
    }
    return false;
  }

  // true if there is not currently any advice listed for this practice for this reading
  noAdvice(practice){
    if(practice.advice=='') {
      return true;
    }
    return false;
  }

}
