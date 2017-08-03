import { Component, OnInit, Input } from '@angular/core';

import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

import {IResource} from '../../../shared/interfaces/resource.interface';

@Component({
  selector: 'app-resource-array',
  templateUrl: './resource-array.component.html',
  styleUrls: ['./resource-array.component.scss']
})
export class ResourceArrayComponent implements OnInit {

  @Input() parentForm: FormGroup;

  @Input() resources: IResource[];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.parentForm.addControl('resources', new FormArray([]));
  }

  addResource() {
    this.resources.push({
      id: null, // for a new resource
      seq: null,
      caption: '',
      description: '',
      author: '',
      date: '',
      medium: '',
      dimensions: '',
      currentLocation: '',
      fileUrl: null, // api endpoint on our server
      originalFileUrl: '', // original source of the image (wikimedia commons, say)
      imageWidth: null, // determined by the server-side code
      imageHeight: null, // determined by the server-side code
      mimeType: '' // determined by server-side code (?)
    });
  }

  removeResource(index: number) {
    if (this.resources.length > 1) {
      this.resources.splice(index, 1);
      (<FormArray>this.parentForm.get('resources')).removeAt(index);
    }
  }

}
