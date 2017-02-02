import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';


import {Application} from '../../../shared/interfaces/application.interface';
import {IPractice} from '../../../shared/interfaces/practice.interface';

@Component({
  selector: 'app-update-practice-form',
  templateUrl: './update-practice-form.component.html',
  styleUrls: ['./update-practice-form.component.css']
})
export class UpdatePracticeFormComponent implements OnInit {
  @Input() readingID: number; // this information if included in the application, if this is an update
  @Input() application: Application = null; //null if new; otherwise it comes in from the parent component
  @Input() availablePractices: IPractice[]; //practices that have not yet been used for this application (not including the current one, if this is an update)

  @Output() submitSuccess = new EventEmitter<boolean>();

  /*
   import {IPractice} from './practice.interface';
   import {Step} from './step.interface';

   export interface Application {
   id: number;
   practice_id: number;
   application_id: number;
   steps: Step[];
   practice: IPractice;
   }
   */

  /**
   * Add new form elements dynamically:
   * https://scotch.io/tutorials/how-to-build-nested-model-driven-forms-in-angular-2
   */


  public applicationForm: FormGroup; // our model driven form

  private isNewApplication: boolean = true;// TODO: fix this

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log('APPLICATION: ', this.application);
    console.log('available practices: ', this.availablePractices);
    console.log('READING ID: ', this.readingID);
    this.initializeForm();

  }

  initializeForm(){
    let applicationFormData: any;
    if (this.application === null){
      applicationFormData = {
        practiceID: null
      };
    } else {
      applicationFormData = {
        practiceID: this.application.practice_id
      };
    }

    this.applicationForm = this.formBuilder.group({
      practiceID: [applicationFormData.practiceID, [<any>Validators.required]],
      steps: this.formBuilder.array([
        this.initStep(),
      ])
    });
    console.log(this.applicationForm);
  }

  initStep() {
    // initialize our address
    return this.formBuilder.group({
      description: ['', Validators.required]
    });
  }

  addStep() {
    // add address to the list
    const control = <FormArray>this.applicationForm.controls['steps'];
    control.push(this.initStep());
  }

  removeStep(i: number) {
    // remove address from the list
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
    let success: boolean = true;
    this.submitSuccess.next(success);
    //
  }

  onCancel(){
    let success: boolean = false;
    this.submitSuccess.next(success);
  }

}
