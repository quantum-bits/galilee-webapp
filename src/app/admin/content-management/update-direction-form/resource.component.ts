import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
// I don't think ChangeDetectorRef is being used...?
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {IResource} from '../../../shared/interfaces/resource.interface';

const resolvedPromise = Promise.resolve(undefined);

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss']
})
export class ResourceComponent implements OnInit {

  @Input() formArray: FormArray;
  @Input() resource: IResource;
  @Input() index: number;
  @Output() removed = new EventEmitter();

  resourceGroup: FormGroup;

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

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.resourceGroup = this.toFormGroup(this.resource);

    resolvedPromise.then(() => {
      this.formArray.push(this.resourceGroup);
    })
  }

  toFormGroup(resource: IResource) {
    return this.formBuilder.group({
      description: [resource.description, Validators.required]
    });
  }

  onCreated(event) {
    event.root.innerHTML = this.resourceGroup.value.description;
  }

  // see: https://toddmotto.com/angular-2-form-controls-patch-value-set-value
  setResourceDescription(event) {
    this.resourceGroup.controls['description'].setValue(event.html);
  }

}
