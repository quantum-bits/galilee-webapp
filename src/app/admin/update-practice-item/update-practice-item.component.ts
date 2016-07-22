import { Component, OnInit, OnDestroy, EventEmitter, Input, Output, ViewChild, ElementRef, Renderer } from '@angular/core';
import {
  FORM_DIRECTIVES,
  REACTIVE_FORM_DIRECTIVES,
  FormBuilder,
  FormGroup,
  // Validators, // not currently being used, but could be used to make a field required
  AbstractControl
} from '@angular/forms';

import {UpdatePracticeItemBindingService} from '../update-practice-item-binding.service';

import {MaterializeDirective} from "angular2-materialize";

@Component({
  moduleId: module.id,
  selector: 'app-update-practice-item',
  templateUrl: 'update-practice-item.component.html',
  styleUrls: ['update-practice-item.component.css'],
  providers: [],
  directives: [MaterializeDirective, FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES]
})
export class UpdatePracticeItemComponent implements OnInit, OnDestroy {

  // Current issue: textarea doesn't do an autoresize when it first opens up; not
  //                obvious to me how to trigger this.  Here is some discussion:
  //                http://materializecss.com/forms.html
  //                maybe something like this...? >>> https://github.com/Dogfalo/materialize/issues/1503

  // great resource for angular2 forms: http://blog.ng-book.com/the-ultimate-guide-to-forms-in-angular-2/

  // Possible issue:  to stop event bubbling we are using event.stopPropagation();
  //                  apparently there are issues for <IE9: http://javascript.info/tutorial/bubbling-and-capturing

  @Input() practice;

  // the 'input' ElementRef is not currently used, but in principle could use
  // it to figure out whether or not the div is open; instead, we're keeping track
  // of that manually via the divOpen boolean
  //@ViewChild('myInput') input: ElementRef;

  // the following ElementRef is used for launching the "save before closing" modal
  // see: http://angularjs.blogspot.de/2016/04/5-rookie-mistakes-to-avoid-with-angular.html

  @ViewChild('myModalSaveMessage') inputSaveMessageModalAnchorTag: ElementRef;

  private editModeOn = false;
  private divOpen = false;

  practiceUpdateForm: FormGroup;
  practiceText: AbstractControl;

  constructor(
    private updatePracticeItemBindingService: UpdatePracticeItemBindingService,
    private renderer: Renderer,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    if (this.noAdvice(this.practice)){
      this.editModeOn = true;
    }
    this.practiceUpdateForm = this.formBuilder.group({
      'practiceText': [this.practice.advice]
    });
    // set form control as an instance variable for convenience
    // (see: http://blog.ng-book.com/the-ultimate-guide-to-forms-in-angular-2/)
    // if don't go this route, would use things like this.practiceUpdateForm.value.practiceText, etc.
    this.practiceText = this.practiceUpdateForm.controls['practiceText'];
  }

  onSubmit(): void {
    this.editModeOn = false;
    // now propagate the change up to edit-reading-resources....
    this.updatePracticeItemBindingService.updatePractice(
      {
        practice: this.practice,
        advice: this.practiceText.value
      }
    );
  }

  onCancel(){// submit the original version of the advice instead
    this.editModeOn = false;
    // submit the original version of the advice instead of the version in the form
    this.updatePracticeItemBindingService.updatePractice(
      {
        practice: this.practice,
        advice: this.practice.advice
      }
    );
  }

  overrideOpenClose(event){//stops event bubbling, so clicking on the 'X' doesn't also open/close the div
    event.stopPropagation();
  }

  toggleDivStatusCheckSaved(event){
    if (!this.editModeOn) {
      this.divOpen = !this.divOpen;
      return; // if edit mode is not on, just return and open/close the div; no problem
    } else { // edit mode is on....
      if (this.divOpen && this.practiceText.dirty) {
        // the advice field is dirty, so need to save it first, before closing
        event.stopPropagation(); // stop the div from closing
        this.renderer.invokeElementMethod(this.inputSaveMessageModalAnchorTag.nativeElement,
          'click'); //launches 'save first before closing' modal....
      } else {
        if (this.practice.advice !='') {
          this.editModeOn = false;
        }
        this.divOpen = !this.divOpen;
      }
    }
  }

  // true if there is not currently any advice listed for this practice for this reading
  noAdvice(practice) {
    if (practice.advice == '') {
      return true;
    }
    return false;
  }

  launchEditMode(){
    if (this.editModeOn) {
      return;//edit mode is already on somehow....; this should not be the case
    } else {
      this.editModeOn = true;
    }
  }

  onDelete(){
    this.updatePracticeItemBindingService.deletePractice(this.practice.id);
    console.log('delete() method fired');
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    //this.subscription.unsubscribe(); //not actually using the subscription here....
  }

}
