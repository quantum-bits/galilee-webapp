import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

import {IReading, ReadingDay} from '../../../shared/interfaces/reading.interface';

import {Application} from '../../../shared/interfaces/application.interface';
import {ApplicationFormData} from '../../../shared/interfaces/application-form-data.interface';

import {IPractice} from '../../../shared/interfaces/practice.interface';

@Component({
  selector: 'app-update-practice-form',
  templateUrl: './update-practice-form.component.html',
  styleUrls: ['./update-practice-form.component.css']
})
export class UpdatePracticeFormComponent implements OnInit, OnChanges {
  @Input() readingDay: ReadingDay = null;
  @Input() readingIndex: number = null; //index of the reading in the readings array (within readingDay)
  @Input() applicationIndex: number = null; //index of the application in the applications array (within readingDay); application index will be null/ignored if this is a new entry
  @Input() isNewApplication: boolean; //true if new, false for an update of an existing application
  @Input() allPractices: IPractice[] = []; //this does not actually seem to initialize it to []
  @Input() incrementer: number = 0;



  // what should pass into this component?!?  readingId?











  modalActions = new EventEmitter();

  @Output() submitSuccess = new EventEmitter<ApplicationFormData>();


  /**
   * Add new form elements dynamically:
   * https://scotch.io/tutorials/how-to-build-nested-model-driven-forms-in-angular-2
   */


  public applicationForm: FormGroup; // our model driven form

  //private isNewApplication: boolean;
  private applicationFormData: ApplicationFormData;
  private availablePractices: IPractice[] = [];
  private havePracticeTypes: boolean = false;
  //private haveApplication: boolean = false;
  private haveReadingDay: boolean = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log('INSIDE FORM! Change....');
    //console.log('APPLICATION: ', this.application);
    console.log('AVAILABLE practices: ', this.allPractices);
    console.log('READINGS Data: ', this.readingDay);
    this.havePracticeTypes = !((this.allPractices === null)||(typeof this.allPractices === 'undefined'));
    //this.haveApplication = !((this.application === null)||(typeof this.application === 'undefined'));
    this.haveReadingDay = !((this.readingDay === null)||(typeof this.readingDay === 'undefined'));
    this.initializeForm();
  }

  initializeForm(){
    console.log('INITIALIZE form; readingDay is: ', this.readingDay);
    console.log('readingIndex: ', this.readingIndex);
    console.log('applicationIndex: ', this.applicationIndex);

    if (this.isNewApplication) {
      this.applicationFormData = {
        id: null, //for a new application
        practiceId: null, // will be set in the form
        readingId: null, //
        steps: [{
          id: null, // for a new application
          description: ''
        }]
      }
    } else {
      let stepData = [];
      let application = this.readingDay.readings[this.readingIndex].applications[this.applicationIndex];

      for (let step of application.steps) {
        stepData.push({
          id: step.id, // Note: step.id is not serving any purpose here, since we lose it later anyways; in any case, the server is going to delete everything and start over
          description: step.description
        });
      }
      this.applicationFormData = {
        id: application.id,
        practiceId: application.practice.id, // TODO: check if this is the correct field
        readingId: application.readingId,
        steps: stepData
      }
    }


    this.determineAvailablePractices();

    this.applicationForm = this.formBuilder.group({
      practiceId: [this.applicationFormData.practiceId, [<any>Validators.required]],
      steps: this.formBuilder.array([
      ])
    });

    for (let step of this.applicationFormData.steps){
      this.addStep(step.description);
    }
    console.log('here is applicationFormData: ', this.applicationFormData);
    console.log('here is the application form: ', this.applicationForm);
  }

  determineAvailablePractices(){
    if (this.havePracticeTypes){
      if (this.isNewApplication){
        this.availablePractices = this.allPractices;
      } else {
        let practiceIdsUsedThisReading = [];// these are (generally) the ones we don't want in the dropdown list
        for (let localApplication of this.readingDay.readings[this.readingIndex].applications){
          practiceIdsUsedThisReading.push(localApplication.practice.id);
        }
        this.availablePractices = [];
        // add one in by hand....
        this.availablePractices.push(this.readingDay.readings[this.readingIndex].applications[this.applicationIndex].practice);
        for (let practice of this.allPractices) {
          if (!(practiceIdsUsedThisReading.indexOf(practice.id) > -1)) {
            this.availablePractices.push(practice);
          }
        }
        console.log('final list: ', this.availablePractices);
      }
    }

  }


  initStep(description?: string) {
    // initialize our step
    return this.formBuilder.group({
      description: [description||'', Validators.required]
    });
  }

  addStep(description?: string) {
    // add step to the list
    const control = <FormArray>this.applicationForm.controls['steps'];
    control.push(this.initStep(description));
  }

  removeStep(i: number) {
    // remove step from the list
    const control = <FormArray>this.applicationForm.controls['steps'];
    control.removeAt(i);
  }


  integerValidator(control) {
    //see: http://stackoverflow.com/questions/34072092/generic-mail-validator-in-angular2
    //http://stackoverflow.com/questions/39799436/angular-2-custom-validator-check-if-the-input-value-is-an-integer
    let INTEGER_REGEXP = /^([0-9]+)$/;
    if (!INTEGER_REGEXP.test(control.value)) {
      return {error: 'This field must be a non-negative integer.'};
    }
  }

  onSubmit(){
    this.applicationFormData.practiceId = +this.applicationForm.value.practiceId;
    let stepData = [];
    for (let step of this.applicationForm.value.steps){
      stepData.push({
        id: null,// let the server figure this out
        description: step.description
      });
    }
    this.applicationFormData['steps']=stepData;

    // hit method in service to post/patch data
    //this.submitSuccess.next(this.applicationFormData);
  }

  onCancel(){
    this.closeModal();
  }

  openModal() {
    this.modalActions.emit({action: "modal", params: ['open']});
  }

  closeModal() {
    this.modalActions.emit({action: "modal", params: ['close']});
  }





}
