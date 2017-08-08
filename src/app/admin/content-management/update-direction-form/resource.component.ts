import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
// I don't think ChangeDetectorRef is being used...?
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {LicenseType, IResource} from '../../../shared/interfaces/resource.interface';

import {IMAGE_URL, IMAGE_UPLOAD, VIDEO_URL, MUSIC_URL, DirectionService} from '../../../shared/services/direction.service';

const resolvedPromise = Promise.resolve(undefined);

export class FormManager {
  // this class contains information and methods related to the
  // the state of the form; in particular, it keeps track of what
  // type of form is being exposed, which depends on whether we are
  // uploading an image from a file, pasting in a url, etc.
  mediaType: string; // one of the media types listed in the direction service

  constructor(mediaType: string) {
    this.mediaType = mediaType;
  }

  getMediaType() {
    let returnVal: string = null;
    switch(this.mediaType) {
      case IMAGE_URL: {
        returnVal = 'Image - url';
        break;
      }
      case IMAGE_UPLOAD: {
        returnVal = 'Image - file upload';
        break;
      }
      case MUSIC_URL: {
        returnVal = 'Music - url';
        break;
      }
      case VIDEO_URL: {
        returnVal = 'Video - url';
        break;
      }
      default: {
        returnVal = 'unknown';
        break;
      }
    }
    return returnVal;
  }

  getSourceFieldText() {
    let returnVal: string = null;
    if (this.mediaType === IMAGE_UPLOAD) {
      returnVal = 'Source (e.g., personal photo)';
    } else {
      returnVal = 'Url of the file (not the page)';
    }
    return returnVal;
  }

  getDescriptionFieldText() {
    let returnVal: string = null;
    switch(this.mediaType) {
      case IMAGE_URL: {
        returnVal = 'image';
        break;
      }
      case IMAGE_UPLOAD: {
        returnVal = 'image';
        break;
      }
      case MUSIC_URL: {
        returnVal = 'music';
        break;
      }
      case VIDEO_URL: {
        returnVal = 'video';
        break;
      }
      default: {
        returnVal = 'unknown';
        break;
      }
    }
    return returnVal;
  }

  displayMediumField() {
    return (this.mediaType === IMAGE_UPLOAD) || (this.mediaType === IMAGE_URL);
  }

  displayPhysicalDimensionsField() {
    return (this.mediaType === IMAGE_UPLOAD) || (this.mediaType === IMAGE_URL);
  }

  displayCurrentLocationField() {
    return (this.mediaType === IMAGE_UPLOAD) || (this.mediaType === IMAGE_URL);
  }

}


@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss']
})
export class ResourceComponent implements OnInit {

  @Input() formArray: FormArray;
  @Input() resource: IResource;
  @Input() index: number;
  @Input() isNewResource: boolean = true;
  @Output() removed = new EventEmitter();

  formManager: FormManager;

  imageUrl: string = IMAGE_URL; // need to make these class-level variables to use them in the template
  imageUpload: string = IMAGE_UPLOAD;
  videoUrl: string = VIDEO_URL;
  musicUrl: string = MUSIC_URL;

  resourceGroup: FormGroup;
  isOpen: boolean = true;
  metadataOpen: boolean = false;
  licenseTypes: LicenseType[] = [];

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

  constructor(private formBuilder: FormBuilder,
              private directionService: DirectionService) {
  }

  ngOnInit() {
    this.formManager = new FormManager(this.resource.mediaType);
    this.resourceGroup = this.toFormGroup(this.resource);

    resolvedPromise.then(() => {
      this.formArray.push(this.resourceGroup);
    });

    this.directionService.getAllLicenseTypes()
      .subscribe(
        licenseTypes => {
          console.log('license types:', licenseTypes);
          this.licenseTypes = licenseTypes;
        },
        error => console.log('error fetching license types: ', error)
      );
  }

  toFormGroup(resource: IResource) {
    return this.formBuilder.group({
      title: [resource.title, Validators.required],
      description: [resource.description],
      creator: [resource.creator],
      creationDate: [resource.creationDate],
      copyrightDate: [resource.copyrightDate],
      licenseId: [resource.licenseType.id, Validators.required],
      medium: [resource.medium],
      physicalDimensions: [resource.physicalDimensions],
      currentLocation: [resource.currentLocation],
      source: [resource.source, Validators.required]
    });
  }

  onCreated(event) {
    event.root.innerHTML = this.resourceGroup.value.description;
  }

  // see: https://toddmotto.com/angular-2-form-controls-patch-value-set-value
  setResourceDescription(event) {
    this.resourceGroup.controls['description'].setValue(event.html);
  }

  toggleOpenClose() {
    this.isOpen = !this.isOpen;
  }

  toggleMetadataOpenClose () {
    this.metadataOpen = !this.metadataOpen;
  }

}
