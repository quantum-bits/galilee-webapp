import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

import {IReading} from '../../../shared/interfaces/readings-data.interface';

import {Application} from '../../../shared/interfaces/application.interface';
import {ApplicationFormData} from '../../../shared/interfaces/application-form-data.interface';

import {IPractice} from '../../../shared/interfaces/practice.interface';

@Component({
  selector: 'app-update-practice-form',
  templateUrl: './update-practice-form.component.html',
  styleUrls: ['./update-practice-form.component.css']
})
export class UpdatePracticeFormComponent implements OnInit, OnChanges {
  @Input() readingId: number; // this information if included in the application, if this is an update
  @Input() application: Application = null; //null if new; otherwise it comes in from the parent component
  @Input() availablePractices: IPractice[] = []; //practices that have not yet been used for this application (not including the current one, if this is an update)
  @Input() incrementer: number;

  modalActions = new EventEmitter();

  @Output() submitSuccess = new EventEmitter<ApplicationFormData>();


  /**
   * Add new form elements dynamically:
   * https://scotch.io/tutorials/how-to-build-nested-model-driven-forms-in-angular-2
   */


  public applicationForm: FormGroup; // our model driven form

  private isNewApplication: boolean;
  private applicationFormData: ApplicationFormData;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log('APPLICATION: ', this.application);
    console.log('available practices: ', this.availablePractices);
    console.log('READING ID: ', this.readingId);
    this.initializeForm();
  }

  initializeForm(){
    console.log('application coming into form: ', this.application);
    if((this.application === null)||(this.application === undefined)){
      this.isNewApplication = true;
      this.applicationFormData = {
        id: null, //for a new application
        practiceTypeId: null,//will be set in the form
        practiceId: null, // for a new application/practice
        readingId: this.readingId,//TODO: may need to think about this....
        steps: [{
          id: null, // for a new application
          description: ''
        }]
      }
    } else {
      this.isNewApplication = false;
      let stepData = [];
      for (let step of this.application.steps) {
        stepData.push({
          id: step.id, // Note: step.id is not serving any purpose here, since we lose it later anyways; in any case, the server is going to delete everything and start over
          description: step.description
        });
      }
      this.applicationFormData = {
        id: this.application.id,
        practiceTypeId: this.application.practiceId, // TODO: check if this is the correct field
        practiceId: this.application.practice.id, // TODO: check if this is the correct field
        readingId: this.application.readingId,
        steps: stepData
      }
    }

    this.applicationForm = this.formBuilder.group({
      practiceTypeId: [this.applicationFormData.practiceTypeId, [<any>Validators.required]],
      steps: this.formBuilder.array([
      ])
    });

    for (let step of this.applicationFormData.steps){
      this.addStep(step.description);
    }
    console.log('here is applicationFormData: ', this.applicationFormData);
    console.log('here is the application form: ', this.applicationForm);
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
    this.applicationFormData.practiceTypeId = +this.applicationForm.value.practiceTypeId;
    let stepData = [];
    for (let step of this.applicationForm.value.steps){
      stepData.push({
        id: null,// let the server figure this out
        description: step.description
      });
    }
    this.applicationFormData['steps']=stepData;
    this.submitSuccess.next(this.applicationFormData);
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
