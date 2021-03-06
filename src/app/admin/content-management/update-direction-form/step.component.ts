import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
// I don't think ChangeDetectorRef is being used...?
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Step} from '../../../shared/interfaces/step.interface';

const resolvedPromise = Promise.resolve(undefined);

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss']
})
export class StepComponent implements OnInit {

  @Input() formArray: FormArray;
  @Input() step: Step;
  @Input() index: number;
  @Output() removed = new EventEmitter();

  stepGroup: FormGroup;

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],        // toggled buttons
      ['blockquote'],// 'code-block'],

      //[{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      //[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      //[{ 'direction': 'rtl' }],                         // text direction

      //[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      //[{ 'header': [3, 4, false] }],
      //['clean'],                                         // remove formatting button

      ['link']                         // link, but not image or video
    ]
  };

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.stepGroup = this.toFormGroup(this.step);

    resolvedPromise.then(() => {
      this.formArray.push(this.stepGroup);
    })
  }

  toFormGroup(step: Step) {
    return this.formBuilder.group({
      description: [step.description,  Validators.required]
    });
  }

  onCreated(event) {
    event.root.innerHTML = this.stepGroup.value.description;
  }

  // see: https://toddmotto.com/angular-2-form-controls-patch-value-set-value
  //      https://stackoverflow.com/questions/42399462/angular2-how-to-set-touched-property-on-from-to-true
  setStepDescription(event) {
    this.stepGroup.controls['description'].setValue(event.html);
  }

  selectionChanged(event) {
    if ((event.range === null) && (event.oldRange !== null)) {
      this.stepGroup.controls['description'].markAsTouched();
    }
  }

}
