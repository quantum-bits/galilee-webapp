import { Component, OnInit, Input } from '@angular/core';

import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

import {Step} from '../../../shared/interfaces/step.interface';

@Component({
  selector: 'app-step-array',
  templateUrl: './step-array.component.html',
  styleUrls: ['./step-array.component.scss']
})
export class StepArrayComponent implements OnInit {

  @Input() parentForm: FormGroup;

  @Input() steps: Step[];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.parentForm.addControl('steps', new FormArray([]));
  }

  addStep() {
    this.steps.push({
      id: null, // for a new direction
      description: '',
      directionId: null,
      seq: null,
      resources: []
    });
  }

  removeStep(index: number) {
    if (this.steps.length > 1) {
      this.steps.splice(index, 1);
      (<FormArray>this.parentForm.get('steps')).removeAt(index);
    }
  }
}
