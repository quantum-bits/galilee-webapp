import { Component, OnInit, OnDestroy, EventEmitter, Input, Output, ViewChild, ElementRef, Renderer, AfterViewInit } from '@angular/core';

import {UpdatePracticeItemBindingService} from '../update-practice-item-binding.service';

import {MaterializeDirective} from "angular2-materialize";

@Component({
  moduleId: module.id,
  selector: 'app-update-practice-item',
  templateUrl: 'update-practice-item.component.html',
  styleUrls: ['update-practice-item.component.css'],
  directives: [MaterializeDirective],
})
export class UpdatePracticeItemComponent implements OnInit, OnDestroy, AfterViewInit {

  // BUGS: Clicking on the 'X' also registers a click on the header element.  This leads to all sorts of problems.
  //  (1) at the moment, if a practice is in edit mode, and you try to
  //      delete the practice, it gives you two modals at once...this is because
  //      clicking on the 'X' also clicks on the header, I think, so it
  //      launches two things
  //  (2) at the moment, clicking edit versus clicking save on an open, empty advice
  //      div has sort of weird behaviour
  //
  // ONE POSSIBLE FIX: we could set the <a> tag for the "delete" modal to not trigger
  //                   on the <i>close(X)</i> (i.e., make it like the trigger for the other
  //                   modal...then make a new <a>close(X)</a>, and make both the header
  //                   click and the 'X' click go to one function, which tries to coordinate
  //                   how to process the click.  The problem will be that both clicks
  //                   might still register and fire off a modal.  Arghh....
  //
  // NOTE: I have used ViewChild and ElementRef in two places.  This appears to
  //       be the correct way to do things:
  //       http://angularjs.blogspot.de/2016/04/5-rookie-mistakes-to-avoid-with-angular.html
  //
  // (1) when the user clicks on "X" to delete a practice, we override the opening/closing
  //     of the div by initiating an extra "click" event on the header element
  //
  // (2) if a collapsible div is OPEN, and editModeOn=true, and the user tries
  //     to close the div, we initiate a click event that launches a modal telling
  //     the user to SAVE first

  @Input() practice;
  @ViewChild('myInput') input: ElementRef;
  @ViewChild('myModalSaveMessage') input2: ElementRef;


  private editModeOn = false;
  private textInput = '';
  private divOpen = false;

  constructor(
    private updatePracticeItemBindingService: UpdatePracticeItemBindingService,
    private renderer: Renderer) {
  }

  ngOnInit() {
    console.log(this.practice);
    if (this.noAdvice(this.practice)){
      this.editModeOn = true;
    }
  }

  ngAfterViewInit(){
    //if (this.noAdvice(this.practice)) {
    //  this.overrideOpenClose();
    //}
  }

  overrideOpenClose(){
    this.renderer.invokeElementMethod(this.input.nativeElement,
      'click');
  }

  // the following toggles on the collapsible-header so we can keep track of whether the div is open or closed
  toggleDivStatus(){
    if ((this.divOpen === true)&&(this.editModeOn)) {//user is attempting to close the div without saving first
      this.overrideOpenClose();
      this.renderer.invokeElementMethod(this.input2.nativeElement,
        'click'); //launches 'save first before closing' modal....
    }
    this.divOpen = !this.divOpen;
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
      return;//edit mode is already on somehow....
    } else {
      this.editModeOn = true;
      this.textInput = this.practice.advice;
    }
  }

  cancel(){
    this.editModeOn = false;
  }

  save(){
    this.editModeOn = false;
    // now propagate the change up to edit-reading-resources....
    this.updatePracticeItemBindingService.updatePractice(
      {
        practice: this.practice,
        advice: this.textInput
      }
    );
    this.textInput='';
    console.log('save() method sent data....');
  }

  delete(){
    this.updatePracticeItemBindingService.deletePractice(this.practice.id);
    console.log('delete() method fired');
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    //this.subscription.unsubscribe(); //not actually using the subscription here....
  }

}
