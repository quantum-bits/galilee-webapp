import {Component, OnInit, EventEmitter} from '@angular/core';
import {Location} from '@angular/common';
import {Observable} from 'rxjs/Observable';

import {UpdatePracticeItemBindingService} from '../update-practice-item-binding.service';
import {UpdateResourceItemBindingService} from '../update-resource-item-binding.service';

import {ReadingService} from '../../../shared/services/reading.service';
import {Reading} from '../../../shared/models/reading.model';
import {ResourceCollection} from '../../../shared/interfaces/resource-collection.interface';

//import { UpdatePracticesComponent } from '../update-practices';
//import {UpdateResourcesComponent} from '../update-resources';

@Component({
  selector: 'app-edit-practices',
  templateUrl: './edit-reading-resources.component.html',
  styleUrls: ['./edit-reading-resources.component.css'],
  providers: [ReadingService, UpdatePracticeItemBindingService, UpdateResourceItemBindingService]
})
export class EditReadingResourcesComponent implements OnInit {
  /*
   NOTE: When we start storing the practice and resource information in the database,
   we will need to update the onUpdatePractice() and onUpdateResourceCollection()
   methods.  Not clear to me if we simply make the change to the db, and then reload
   the page to let everything refresh, or if we want to make the changes locally
   in order to minimize trips to the database.  In any case, we will need to take
   a look at those methods to see if they make sense....
   */

  date: Date;
  readings: Reading[] = [];
  currentReading: any;//reading being shown in current tab
  private changeTracker = 0;//this is a hack to get ngOnChanges to fire when the practices are updated...it doesn't fire if something deep in a nested object changes

  constructor(//private _location:Location,
    //private practiceService:PracticeService,
    private readingService: ReadingService,
    private updatePracticeItemBindingService: UpdatePracticeItemBindingService,
    private updateResourceItemBindingService: UpdateResourceItemBindingService) {
    console.log('inside edit-reading-resources constructor');

    updatePracticeItemBindingService.practiceUpdated$.subscribe(
      practiceWithAdvice => {
        this.onUpdatePractice(practiceWithAdvice);
      });
    updatePracticeItemBindingService.practiceDeleted$.subscribe(
      practiceID => {
        this.onDeletePractice(practiceID);
      });
    updateResourceItemBindingService.resourceUpdated$.subscribe(
      resourceCollection => {
        this.onUpdateResourceCollection(resourceCollection);
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
    console.log('practice updated! inside edit-reading-resources component');
    console.log(this.currentReading);
    console.log(response);
    console.log()
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
      this.currentReading.practices.splice(practiceArrayIndex, 1);
    }
  }

  onUpdateResourceCollection(dataPacket) {
    this.changeTracker++;
    console.log('updating resource collection');
    console.log(dataPacket);
    let newCollection = dataPacket.newCollection;
    let resourceCollection: ResourceCollection = dataPacket.resourceCollection;
    let collectionID: number;
    let collectionIndex: number;
    if (newCollection) {// new entry
      this.currentReading.resourceCollections.push(resourceCollection);
    } else {//editing existing entry...need to find it by its id
      for (let i in this.currentReading.resourceCollections) {
        if (resourceCollection.id === this.currentReading.resourceCollections[i].id) {
          collectionIndex = +i;//using the '+' to cast the string as a number
          console.log('index:');
          console.log(collectionIndex);
        }
      }
      this.currentReading.resourceCollections[collectionIndex] = resourceCollection;
    }
    console.log('here is the new version of current reading:');
    console.log(this.currentReading);
  }
}
