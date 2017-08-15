import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
// I don't think ChangeDetectorRef is being used...?
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {License, IResource} from '../../../shared/interfaces/resource.interface';

import {MediaTypeOptions, DirectionService} from '../../../shared/services/direction.service';

const resolvedPromise = Promise.resolve(undefined);

export class FormManager {
  // this class contains information and methods related to the
  // the state of the form; in particular, it keeps track of what
  // type of form is being exposed, which depends on whether we are
  // uploading an image from a file, pasting in a url, etc.
  mediaTypeElement: number; // one of the enums in MediaTypeOptions

  constructor(mediaTypeElement: number) {
    this.mediaTypeElement = mediaTypeElement;
  }

  getMediaType() {
    let returnVal: string = null;
    switch(this.mediaTypeElement) {
      case MediaTypeOptions.imageUrl: {
        returnVal = 'Image - url';
        break;
      }
      case MediaTypeOptions.imageUpload: {
        returnVal = 'Image - file upload';
        break;
      }
      case MediaTypeOptions.musicUrl: {
        returnVal = 'Music - url';
        break;
      }
      case MediaTypeOptions.videoUrl: {
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

  getMediaTypeId() {
    return this.mediaTypeElement;
  }

  getDescriptionFieldText() {
    let returnVal: string = null;
    switch(this.mediaTypeElement) {
      case MediaTypeOptions.imageUrl: {
        returnVal = 'image';
        break;
      }
      case MediaTypeOptions.imageUpload: {
        returnVal = 'image';
        break;
      }
      case MediaTypeOptions.musicUrl: {
        returnVal = 'music';
        break;
      }
      case MediaTypeOptions.videoUrl: {
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
    return (this.mediaTypeElement === MediaTypeOptions.imageUpload) || (this.mediaTypeElement === MediaTypeOptions.imageUrl);
  }

  displayPhysicalDimensionsField() {
    return (this.mediaTypeElement === MediaTypeOptions.imageUpload) || (this.mediaTypeElement === MediaTypeOptions.imageUrl);
  }

  displayCurrentLocationField() {
    return (this.mediaTypeElement === MediaTypeOptions.imageUpload) || (this.mediaTypeElement === MediaTypeOptions.imageUrl);
  }

  uploadFromHardDrive() {
    // returns true if the user is to upload a file from their computer
    // (as opposed to specifying a url for the file)
    return this.mediaTypeElement === MediaTypeOptions.imageUpload;
  }

  uploadFromUrl() {
    return (this.mediaTypeElement === MediaTypeOptions.imageUrl) || (this.mediaTypeElement === MediaTypeOptions.musicUrl) || (this.mediaTypeElement === MediaTypeOptions.videoUrl);
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

  resourceGroup: FormGroup;
  isOpen: boolean = true;
  metadataOpen: boolean = false;
  licenses: License[] = [];

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
    this.formManager = new FormManager(this.resource.mediaType.id);
    this.resourceGroup = this.toFormGroup(this.resource);

    resolvedPromise.then(() => {
      this.formArray.push(this.resourceGroup);
    });

    this.directionService.getAllLicenses()
      .subscribe(
        licenses => {
          console.log('license types:', licenses);
          this.licenses = licenses;
        },
        error => console.log('error fetching license types: ', error)
      );
  }

  // TODO: eventually include tags
  toFormGroup(resource: IResource) {
    // note: it's convenient to include the mediaTypeId in the
    //       formGroup so that the (parent) direction form will
    //       know this information
    let formGroup = this.formBuilder.group({
      title: [resource.title, Validators.required],
      description: [resource.description],
      creator: [resource.creator],
      creationDate: [resource.creationDate],
      copyrightDate: [resource.copyrightDate],
      licenseId: [resource.license.id, Validators.required],
      medium: [resource.medium],
      physicalDimensions: [resource.physicalDimensions],
      currentLocation: [resource.currentLocation],
      source: [resource.source],
      mediaTypeId: [this.formManager.getMediaTypeId()]
    });
    let sourceUrlControl: FormControl;
    if (this.formManager.uploadFromUrl()) {
      sourceUrlControl = new FormControl(resource.sourceUrl, Validators.required);
      } else {
      sourceUrlControl = new FormControl(resource.sourceUrl);
    }
    formGroup.addControl('sourceUrl', sourceUrlControl);
    return formGroup;
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
