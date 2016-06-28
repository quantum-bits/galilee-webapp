import {Component, OnInit, EventEmitter} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {Location} from '@angular/common';

import {MaterializeDirective} from "angular2-materialize";

//import {PracticeService} from '../../shared/services/practice.service';
//import {Practice} from '../../shared/models/practice.model';
import {ReadingService} from '../../shared/services/reading.service';
import {Reading} from '../../shared/models/reading.model';

import { UpdatePracticesComponent } from '../update-practices';

// useful resource for using Materialize components that require js:
// https://github.com/InfomediaLtd/angular2-materialize/tree/master/app/components

@Component({
  moduleId: module.id,
  selector: 'app-edit-practices',
  templateUrl: 'edit-reading-resources.component.html',
  styleUrls: ['edit-reading-resources.component.css'],
  providers: [ReadingService],
  directives: [ROUTER_DIRECTIVES, MaterializeDirective, UpdatePracticesComponent],
  //inputs: ['model: textInput'],
  //outputs: ['textInputChange'],

})
export class EditReadingResourcesComponent implements OnInit {

  date:Date;
  readings:Reading[] = [];
  currentReading:any;//reading being shown in current tab

  constructor(//private _location:Location,
    //private practiceService:PracticeService,
    private readingService:ReadingService) {
  }

  ngOnInit() {
    this.date = new Date();

    // FIXME hardcoded readings; assumes there is at least one reading...FIX!!!
    this.readingService.getTodaysReadings().then(
      (readings) => {
        this.readings = readings;
        var reading = this.readings[0];
        this.currentReading = reading;
      });
  }


  updateTab(reading) {
    this.currentReading = reading;
    //this.fetchUnusedPractices();
  }


  // true if the reading passed in is the current reading being shown in the tab
  isActive(reading) {
    if (reading.id == this.currentReading.id) {
      return true;
    }
    return false;
  }

  onUpdatePractice(response) {
    console.log(response);
    var practice = response.practice;
    var textInput = response.textInput;

    // used to add a new practice to this.currentReading or to edit an existing practice

    var practiceAlreadyInUse = false; // true if this practice is already in use for this reading
    var practiceArrayIndex = null;
    for (let i in this.currentReading.practices) {// using for...in so that I can get the index
      if (practice.id === this.currentReading.practices[i].id) {
        practiceAlreadyInUse = true;
        practiceArrayIndex = i;
      }
    }
    if (practiceAlreadyInUse) { //update the practice and associated advice
      this.currentReading.practices[practiceArrayIndex] =
      {
        id: practice.id,
        title: practice.title,
        advice: textInput
      }
    } else { //add the new practice and associated advice
      this.currentReading.practices.push(
        {
          id: practice.id,
          title: practice.title,
          advice: textInput
        }
      );
    }
  }

}
