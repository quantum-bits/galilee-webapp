import { Component, OnInit, OnDestroy, Input} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  // Validators, // not currently being used, but could be used to make a field required
  AbstractControl
} from '@angular/forms';

import {UpdatePracticeItemBindingService} from '../update-practice-item-binding.service';

declare var $: any; // for using jQuery within this angular component

@Component({
  selector: 'update-practice-item',
  templateUrl: './update-practice-item.component.html',
  styleUrls: ['./update-practice-item.component.css'],
  providers: []
})
export class UpdatePracticeItemComponent implements OnInit, OnDestroy {

  // great resource for angular2 forms: http://blog.ng-book.com/the-ultimate-guide-to-forms-in-angular-2/

  // Possible issue:  to stop event bubbling we are using event.stopPropagation();
  //                  apparently there are issues for <IE9: http://javascript.info/tutorial/bubbling-and-capturing

  @Input() practice;

  editModeOn = false;
  private divOpen = false;

  practiceUpdateForm: FormGroup;
  practiceText: AbstractControl;

  constructor(
    private updatePracticeItemBindingService: UpdatePracticeItemBindingService,
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
        this.launchSaveFirstModal();
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
    // the following is a bit of a hack that puts the method
    // call to autoResizeTextArea() at the end of the queue; otherwise
    // there is a problem in that the resizing gets done prematurely and
    // doesn't always give a large enough text area (probably because the 'drawer' is
    // still sliding open...?); the 'delay' is 0 ms; the important thing is
    // that the method call now gets put at the end of the queue.
    // NOTE: apparently using the custom textarea-autoresize tag doesn't work, because
    //       of the animation involved with the drawer....
    setTimeout(()=> this.autoResizeTextArea(), 0);
  }

  onDelete(){
    this.updatePracticeItemBindingService.deletePractice(this.practice.id);
    console.log('delete() method fired');
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    //this.subscription.unsubscribe(); //not actually using the subscription here....
  }

  launchSaveFirstModal(){
    let modalID = '#modalSaveFirst'+this.practice.id;
    console.log(modalID);
    $(modalID).openModal();
  }

  autoResizeTextArea(){
    let textareaID = '#textareaAdvice'+this.practice.id;
    console.log(textareaID);
    $(textareaID).trigger('autoresize');
  }

}
