import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {IReading} from '../../../shared/interfaces/readings-data.interface';


@Component({
  selector: 'app-update-reading-form',
  templateUrl: './update-reading-form.component.html',
  styleUrls: ['./update-reading-form.component.css']
})
export class UpdateReadingFormComponent implements OnInit {

  @Input() reading: IReading = null;
  @Output() submitSuccess = new EventEmitter<boolean>();

  public readingForm: FormGroup; // our model driven form

  private isNewReading: boolean = true;// TODO: fix this

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log('READING: ', this.reading);
    this.initializeForm();

  }


  initializeForm(){
    let readingFormData: any;
    if (this.reading === null){
      readingFormData = {
        osis: null,
        seq: null
      };
    } else {
      readingFormData = {
        osis: this.reading.osis_ref,
        seq: this.reading.seq
      };
    }

    this.readingForm = this.formBuilder.group({
      osis: [readingFormData.osis, [<any>Validators.required]],
      seq: [readingFormData.seq, Validators.compose([<any>Validators.required, this.integerValidator])]
    });
    console.log(this.readingForm);
  }

  integerValidator(control) {
    //see: http://stackoverflow.com/questions/34072092/generic-mail-validator-in-angular2
    //http://stackoverflow.com/questions/39799436/angular-2-custom-validator-check-if-the-input-value-is-an-integer
    let INTEGER_REGEXP = /^([0-9]+)$/;
    if (!INTEGER_REGEXP.test(control.value)) {
      return {error: 'This field must be a non-negative integer.'};
    }
  }

  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
  filterInt(value) {
    if (/^([0-9]+)$/.test(value)) {
      return Number(value);
    } else {
      return NaN;
    }
  }

  /*
  function isInteger(value){
  if((parseFloat(value) == parseInt(value)) && !isNaN(value)){
    // I can have spacespacespace1 - which is 1 and validators pases but
    // spacespacespace doesn't - which is what i wanted.
    // 1space2 doesn't pass - good
    // of course, when saving data you do another parseInt.
    return true;
  } else {
    return false;
  }
  */


  onSubmit(){
    let success: boolean = true;
    this.submitSuccess.next(success);
    //
  }




}
