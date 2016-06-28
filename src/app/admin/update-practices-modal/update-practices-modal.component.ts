import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {MaterializeDirective} from "angular2-materialize";

@Component({
  moduleId: module.id,
  selector: 'app-update-practices-modal',
  templateUrl: 'update-practices-modal.component.html',
  styleUrls: ['update-practices-modal.component.css'],
  directives: [MaterializeDirective]
})
export class UpdatePracticesModalComponent implements OnInit {

  @Input() currentPractice;
  @Input() textInput;
  @Input() unusedPractices;
  @Output() onUpdatePractice = new EventEmitter();
  @Output() onCancel = new EventEmitter();

  //textInput:string = '';//text area input that will eventually be saved as the "advice" for a practice for a reading

  constructor() {}

  ngOnInit() {
  }

  updateAdvice() {
    console.log(this.currentPractice);
    console.log('inside modal here: some text input....');
    console.log(this.textInput);
    this.onUpdatePractice.emit(
      {
        practice: this.currentPractice,
        textInput: this.textInput
      }
    );
    this.cleanUp();
  }

  // called upon exiting modal; resets various things....
  cleanUp() {
    this.textInput = '';
    this.currentPractice = null;
    //this.fetchUnusedPractices();
  }

  cancelReadingEdits() {
    // clean up for modal exit
    this.cleanUp();
    this.onCancel.emit({});//triggers a cleanUp in the parent component as well
  }

  // sets the practice that is currently in play (the one being added/edited)
  setCurrentPractice(practiceId) {
    for (var practice of this.unusedPractices) {
      if (practiceId === practice.id) {
        this.currentPractice = practice;
      }
    }
  }




}
