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
      creator: '',
      creationDate: '',
      copyrightDate: '',
      importDate: null, // for a new resource
      licenseType: {
        id: null,
        name: ''
      },
      keywords: '',
      source: '', // original source of the image (url at wikimedia commons, say, or 'I took this picture by my house')
      mimeType: '', // determined by server-side code (?)
      title: '',
      description: '',
      notes: '',
      height: null,
      width: null,
      medium: '',
      physicalDimensions: '',
      currentLocation: ''
    });
  }

  removeResource(index: number) {
    if (this.resources.length > 0) {
      this.resources.splice(index, 1);
      (<FormArray>this.parentForm.get('resources')).removeAt(index);
    }
  }

}
