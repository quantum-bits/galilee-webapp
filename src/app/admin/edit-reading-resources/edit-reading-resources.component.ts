import {Component, OnInit, EventEmitter} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {Location} from '@angular/common';
import { Observable } from 'rxjs/Observable';

import {UpdatePracticeItemBindingService} from '../update-practice-item-binding.service';

import {MaterializeDirective} from "angular2-materialize";

import {ReadingService} from '../../shared/services/reading.service';
import {Reading} from '../../shared/models/reading.model';

import { UpdatePracticesComponent } from '../update-practices';
import {UpdateResourcesComponent} from '../update-resources';

// useful resource for using Materialize components that require js:
// https://github.com/InfomediaLtd/angular2-materialize/tree/master/app/components

@Component({
  moduleId: module.id,
  selector: 'app-edit-practices',
  templateUrl: 'edit-reading-resources.component.html',
  styleUrls: ['edit-reading-resources.component.css'],
  providers: [ReadingService, UpdatePracticeItemBindingService],
  directives: [
    ROUTER_DIRECTIVES,
    MaterializeDirective,
    UpdatePracticesComponent,
    UpdateResourcesComponent,
  ],
})
export class EditReadingResourcesComponent implements OnInit {

  date:Date;
  readings:Reading[] = [];
  currentReading:any;//reading being shown in current tab
  private changeTracker = 0;//this is a hack to get ngOnChanges to fire when the practices are updated...it doesn't fire if something deep in a nested object changes

  constructor(//private _location:Location,
    //private practiceService:PracticeService,
    private readingService:ReadingService,
    private updatePracticeItemBindingService:UpdatePracticeItemBindingService) {
    updatePracticeItemBindingService.practiceUpdated$.subscribe(
      practiceWithAdvice => {
        this.onUpdatePractice(practiceWithAdvice);
      });
    updatePracticeItemBindingService.practiceDeleted$.subscribe(
      practiceID => {
        this.onDeletePractice(practiceID);
      });
  }

  ngOnInit() {
    this.date = new Date();
    // FIXME hardcoded readings; assumes there is at least one reading...FIX!!!
    this.readingService.getTodaysReadingsAsObservable().subscribe(
      readings => {
        this.readings = readings;
        var reading = this.readings[0];
        this.currentReading = reading;
        console.log(readings);
      },
      err => console.log("ERROR", err),
      () => console.log("Readings fetched"));
  }


  updateTab(reading) {
    this.currentReading = reading;
    this.changeTracker++;
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
    this.changeTracker++;
    console.log(response);
    var practice = response.practice;
    var advice = response.advice;

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
        advice: advice
      }
    } else { //add the new practice and associated advice
      this.currentReading.practices.push(
        {
          id: practice.id,
          title: practice.title,
          advice: advice
        }
      );
    }
  }

  onDeletePractice(practiceID) {
    this.changeTracker++;
    console.log(practiceID);
    // used to delete a practice (and its associated advice) from this.currentReading
    // http://www.c-sharpcorner.com/UploadFile/5089e0/array-object-in-typescript-part-6/
    var practiceArrayIndex = null;
    for (let i in this.currentReading.practices) {// using for...in so that I can get the index
      if (practiceID === this.currentReading.practices[i].id) {
        practiceArrayIndex = i;
      }
    }
    if (practiceArrayIndex !== null) { //update the practice and associated advice
      this.currentReading.practices.splice(practiceArrayIndex,1);
    }
  }




}
