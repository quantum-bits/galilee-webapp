import { Component, OnInit, Input } from '@angular/core';

import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

import {IResource} from '../../../shared/interfaces/resource.interface';

import {IMAGE_URL, IMAGE_UPLOAD, VIDEO_URL, MUSIC_URL} from '../../../shared/services/direction.service';

@Component({
  selector: 'app-resource-array',
  templateUrl: './resource-array.component.html',
  styleUrls: ['./resource-array.component.scss']
})
export class ResourceArrayComponent implements OnInit {

  @Input() parentForm: FormGroup;
  @Input() resources: IResource[];

  imageUrl: string = IMAGE_URL; // need to make these class-level variables to use them in the template
  imageUpload: string = IMAGE_UPLOAD;
  videoUrl: string = VIDEO_URL;
  musicUrl: string = MUSIC_URL;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.parentForm.addControl('resources', new FormArray([]));
  }

  addResource(mediaType: string) {
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
      currentLocation: '',
      duration: '',
      mediaType: mediaType
    });
  }

  removeResource(index: number) {
    if (this.resources.length > 0) {
      this.resources.splice(index, 1);
      (<FormArray>this.parentForm.get('resources')).removeAt(index);
    }
  }

}
