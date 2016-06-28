import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

import {PracticeService} from '../../shared/services/practice.service';
import {Practice} from '../../shared/models/practice.model';

import {MaterializeDirective} from "angular2-materialize";


@Component({
  moduleId: module.id,
  selector: 'app-update-practices',
  templateUrl: 'update-practices.component.html',
  styleUrls: ['update-practices.component.css'],
  directives: [MaterializeDirective]
})
export class UpdatePracticesComponent implements OnInit {

  @Input() practicesThisReading; ///////WHERE to have practices for this reading?!?!?!?
  // I think they're all bundled up with reading after the GET from ther server
  // ...they get passed to the component, which then grabs available practices, etc.
  // and then does things from that point, communicating to the parent if there are
  // changes, etc....
  //
  // data integrity question -- what if a practice type gets deleted...do all of the
  // associated practices (and their advice) get deleted, too?
  @Output() onUpdatePractice = new EventEmitter();

  checkedAnswerID = null;

  practices:Practice[] = [];
  unusedPractices = [];//unused practices for the current reading
  currentPractice:any = null;//practice that is currently being added/edited in modal(s)
  textInput:string = '';//text area input that will eventually be saved as the "advice" for a practice for a reading


  constructor(
    private practiceService:PracticeService) {}

  ngOnInit() {
    this.practiceService.getPractices().subscribe(
      practices => {
        this.practices = practices;
        this.fetchUnusedPractices();
      },
      err => console.log("ERROR", err),
      () => console.log("Practices fetched"));
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

  // sets the practice that is currently in play (the one being added/edited)
  setCurrentPractice(practiceId) {
    for (var practice of this.practices) {
      if (practiceId === practice.id) {
        this.currentPractice = practice;
      }
    }
  }

  // performs some initialization so that this.currentReading.practices[i] can be edited
  initializeEditAdviceModal(practiceWithAdvice) {
    this.setCurrentPractice(practiceWithAdvice.id);
    this.textInput = practiceWithAdvice.advice;
  }

  // called upon exiting modal; resets various things....
  cleanUp() {
    this.textInput = '';
    this.currentPractice = null;
    this.fetchUnusedPractices();
  }

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
    /*
    this.onAnswered.emit(
      {
        questionID: questionID,
        answerID: answerID
      }
    );
    this.checkedAnswerID = answerID;
    */
  }


}
