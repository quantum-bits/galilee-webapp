import { Component, OnInit, OnChanges, EventEmitter, Input, Output } from '@angular/core';

import {PracticeService} from '../../shared/services/practice.service';
import {Practice} from '../../shared/models/practice.model';
import {UpdatePracticesModalComponent} from '../update-practices-modal';
import { UpdatePracticeItemComponent } from '../update-practice-item';

import {MaterializeDirective} from "angular2-materialize";


@Component({
  moduleId: module.id,
  selector: 'app-update-practices',
  templateUrl: 'update-practices.component.html',
  styleUrls: ['update-practices.component.css'],
  directives: [MaterializeDirective, UpdatePracticesModalComponent, UpdatePracticeItemComponent]
})
export class UpdatePracticesComponent implements OnInit, OnChanges {

  @Input() practicesThisReading;
  // using changeTracker as a simple way to track changes that are propagating down
  // from the parent to this, the child; ngOnChanges only fires when an input
  // changes, and changes to nested objects inside of practicesThisReading, reflected
  // in the page, do not trigger ngOnChanges...so this is a bit of a work-around
  @Input() changeTracker;
  @Output() onUpdatePractice = new EventEmitter();

  practices:Practice[] = [];
  unusedPractices = [];//unused practices for the current reading
  currentPractice:any = null;//practice that is currently being added/edited in modal(s)
  textInput:string = '';//text area input that will eventually be saved as the "advice" for a practice for a reading

  buttonDisabled = false;
  //showUpdatePracticeModal = false;

  constructor(
    private practiceService:PracticeService) {}

  ngOnInit() {
    this.practiceService.getPractices().subscribe(
      practices => {
        this.practices = practices;
        this.fetchUnusedPractices();
        this.buttonDisabled = this.noUnusedPractices();
      },
      err => console.log("ERROR", err),
      () => console.log("Practices fetched"));
  }

  ngOnChanges() {
    this.fetchUnusedPractices();
    this.buttonDisabled = this.noUnusedPractices();
  }

  // fetches the practices that are not currently associated with the current reading
  fetchUnusedPractices() {
    this.unusedPractices = [];
    var alreadyInUse:boolean;
    for (var practice of this.practices) {
      alreadyInUse = false;
      for (var usedPractice of this.practicesThisReading) {
        if (usedPractice.id === practice.id) {
          alreadyInUse = true;
        }
      }
      if (!alreadyInUse) {
        this.unusedPractices.push(practice);
      }
    }
  }

  // true if all practices are now in use; this is used to disable the
  // Add button
  noUnusedPractices() {
    if (this.unusedPractices.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  // passes a new practice up to the parent; the practice has no advice at this point
  addPractice(practice){
    this.onUpdatePractice.emit(
      {
        practice: practice,
        textInput: ''
      }
    );
  }

  /*
  // sets the practice that is currently in play (the one being added/edited)
  setCurrentPractice(practiceId) {
    for (var practice of this.practices) {
      if (practiceId === practice.id) {
        this.currentPractice = practice;
      }
    }
  }
  */

  /*
  // performs some initialization so that this.currentReading.practices[i] can be edited
  initializeEditAdviceModal(practiceWithAdvice) {
    this.setCurrentPractice(practiceWithAdvice.id);
    this.textInput = practiceWithAdvice.advice;
    //this.showUpdatePracticeModal = true;
  }
  */
  /*
  // called upon exiting modal; resets various things....
  cleanUp() {
    this.textInput = '';
    this.currentPractice = null;
    this.fetchUnusedPractices();
  }
  */
  /*
  cancelReadingEdits() {
    // clean up for modal exit
    this.cleanUp();
  }

  // true if there is not currently any advice listed for this practice for this reading
  noAdvice(practice) {
    if (practice.advice == '') {
      return true;
    }
    return false;
  }
  */
  /*
  updateAdvice() {
    console.log(this.currentPractice);
    console.log('and some text input....');
    console.log(this.textInput);
    this.onUpdatePractice.emit(
      {
        practice: this.currentPractice,
        textInput: this.textInput
      }
    );
    this.cleanUp();
  }

  passEventUp(response) {
    this.cleanUp();
    this.onUpdatePractice.emit(response);//passes the response (received from this comp's child) up to the parent
  }

  onModalCancel(response) {
    this.cleanUp();
  }
  */

}
