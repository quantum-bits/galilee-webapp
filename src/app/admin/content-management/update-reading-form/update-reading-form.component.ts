import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {IReading} from '../../../shared/interfaces/reading.interface';


@Component({
  selector: 'app-update-reading-form',
  templateUrl: './update-reading-form.component.html',
  styleUrls: ['./update-reading-form.component.css']
})
export class UpdateReadingFormComponent implements OnInit {

  @Input() readingDayId: number;// if new, then this comes in
  @Input() reading: IReading; // if update, then this comes in (and it contains the readingDayId)
  @Input() incrementer: number; // this is to force ngOnChanges to fire in the update-reading-form component
  @Output() submitSuccess = new EventEmitter();

  modalActions = new EventEmitter();

  /**
   * note that the incrementer is just a trick to get ngOnChanges to fire; if we don't
   * do this, we sometimes get unexpected behaviour (for example, if the user
   * edits the form, hits cancel, and then clicks edit again.
   */

  public readingForm: FormGroup; // our model driven form

  private isNewReading: boolean;
  private readingFormData: IReading;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log('Change!!  READING: ', this.reading);
    this.initializeForm();
  }

  initializeForm(){
    if ((this.reading === null)||(this.reading === undefined)){
      this.isNewReading = true;
      this.readingFormData = {
        id: null,
        osisRef: null,
        readingDayId: null,//does this need to be there?
        seq: null,
        stdRef: null,
        text: null,
        version: null
      };
    } else {
      this.isNewReading = false;
      this.readingFormData = this.reading;
      console.log('editing reading; readingFormData: ', this.readingFormData);
      /*{
        readingDayId: this.reading.readingDayId,
        osisRef: this.reading.osisRef,
        stdRef: this.reading.stdRef,
        seq: this.reading.seq
      };
      */
    }

    this.readingForm = this.formBuilder.group({
      osisRef: [this.readingFormData.osisRef, [<any>Validators.required]],
      stdRef: [this.readingFormData.stdRef, [<any>Validators.required]],
      seq: [this.readingFormData.seq, Validators.compose([<any>Validators.required, this.integerValidator])]
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

  onSubmit(){
    Object.assign(this.readingFormData, this.readingForm.value);
    this.submitSuccess.next({reading: this.readingFormData, isNewReading: this.isNewReading});
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
