import { Component, OnInit, Input } from '@angular/core';

import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

import {IResource} from '../../../shared/interfaces/resource.interface';

import {MediaTypeOptions} from '../../../shared/services/direction.service';

@Component({
  selector: 'app-resource-array',
  templateUrl: './resource-array.component.html',
  styleUrls: ['./resource-array.component.scss']
})
export class ResourceArrayComponent implements OnInit {

  @Input() parentForm: FormGroup;
  @Input() resources: IResource[];

  mediaTypeOptions = MediaTypeOptions;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.parentForm.addControl('resources', new FormArray([]));
  }

  addResource(mediaTypeElement: number) {
    this.resources.push({
      id: null, // for a new resource
      seq: null,
      creator: '',
      creationDate: '',
      copyrightDate: '',
      importDate: null, // for a new resource
      license: {
        id: null,
        name: '',
        description: '',
        url: ''
      },
      tags: [],
      sourceUrl: '', // original source of the image (url at wikimedia commons, say)
      source: '', // free-form text (e.g., 'I took this picture by my house'); only used in the case that the file is uploaded from the user's hard drive
      fileUUID: '', // determined by server-side code, but inserted in the form upon upload of the file
      mimeType: null, // determined by server-side code
      title: '',
      description: '',
      notes: '',
      height: null, // determined by server-side code
      width: null, // determined by server-side code
      medium: '',
      physicalDimensions: '',
      currentLocation: '',
      duration: '',
      mediaType: {
        id: mediaTypeElement, //one of the enum values in MediaTypeOptions in the direction service
        description: '' //TODO could get this from the server, but it's probably not important here....
      }
    });
  }

  removeResource(index: number) {
    if (this.resources.length > 0) {
      this.resources.splice(index, 1);
      (<FormArray>this.parentForm.get('resources')).removeAt(index);
    }
  }

}
