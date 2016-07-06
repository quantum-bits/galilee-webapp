import { Component, OnInit, OnChanges, EventEmitter, Input, Output } from '@angular/core';

import {PracticeService} from '../../shared/services/practice.service';
import {Practice} from '../../shared/models/practice.model';

import { UpdatePracticeItemComponent } from '../update-practice-item';

import {MaterializeDirective} from "angular2-materialize";


@Component({
  moduleId: module.id,
  selector: 'app-update-practices',
  templateUrl: 'update-practices.component.html',
  styleUrls: ['update-practices.component.css'],
  directives: [MaterializeDirective, UpdatePracticeItemComponent]
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
    console.log('change detected');
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
        advice: ''
      }
    );
  }

}
