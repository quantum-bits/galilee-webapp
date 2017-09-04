import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';

import {IResource} from '../../shared/interfaces/resource.interface';

import {TruncatePipe} from '../../shared/pipes/truncate.pipe';

const TRUNCATION_LIMIT = 200; //number of characters in a description after which to truncate

@Component({
  selector: 'app-image-item',
  templateUrl: './image-item.component.html',
  styleUrls: ['./image-item.component.scss']
})
export class ImageItemComponent implements OnInit {

  @Input() resource: IResource;
  @Output() openModal = new EventEmitter();
  @Output() openMetadataModal = new EventEmitter();
  @ViewChild('imageContainer') imageContainer: ElementRef;
  @ViewChild('imageTag') imageTag: ElementRef;

  allowTruncation: boolean = true;//allow truncation of text for this entry
  truncationLimit: number = TRUNCATION_LIMIT;

  constructor() { }

  ngOnInit() {
  }

  // Description long enough to be truncated after numChars words?
  // To determine this, we call the truncate pipe directly and compare the result
  // against the original string; if it's different, we assume that the description
  // has, in fact, been truncated.
  // see: https://stackoverflow.com/questions/35144821/angular-2-4-use-pipes-in-services-and-components
  descriptionIsLong(numCharacters: number): boolean {
    //return (this.resource.description.split(" ").length >= numWords);
    let truncatePipeFilter = new TruncatePipe();
    let truncatedDescription = truncatePipeFilter.transform(this.resource.description, numCharacters);
    return this.resource.description !== truncatedDescription;
  }

  toggleAllowTruncation() {
    this.allowTruncation = !this.allowTruncation;
  }

  launchModal(){
    this.openModal.emit();
  }

  launchMetadataModal(){
    this.openMetadataModal.emit();
  }

  pxToNumber(val: string) {
    // extracts a numeric value from a string such as '10.875px'
    let parsedArray = val.split('px');
    return +parsedArray[0];
  }

  //https://stackoverflow.com/questions/5071040/java-convert-integer-to-string
  numberToPx(val: number) {
    return val.toString()+'px';
  }

  getContainerDimensions() {
    let computedStyle = window.getComputedStyle(this.imageTag.nativeElement,null);
    let width = this.pxToNumber(computedStyle.width);
    let height = this.pxToNumber(computedStyle.height);
    //return {width: width, height: height};
    console.log('width: ', width, 'height: ', height);
  }

  imageIconContainerStyle() {
    let imageTagComputedStyle = window.getComputedStyle(this.imageTag.nativeElement,null);
    let imageTagHeight = this.pxToNumber(imageTagComputedStyle.height);
    let imageContainerComputedStyle = window.getComputedStyle(this.imageContainer.nativeElement,null);
    let imageContainerHeight = this.pxToNumber(imageContainerComputedStyle.height);
    let bottom = this.numberToPx(imageContainerHeight - imageTagHeight);
    return {'margin-bottom': bottom, 'margin-top': bottom};
  }

  /*
  determineWidth() {
    let width = this.resource.width;
    let height = this.resource.height;
    let containerDimensions = this.getContainerDimensions();
    let widthRatio = width/containerDimensions.width;
    let heightRatio = height/containerDimensions.height;
    if (widthRatio < heightRatio) {
      return containerDimensions.width;
    } else {
      return 'auto';
    }
  }

  determineHeight() {
    let width = this.resource.width;
    let height = this.resource.height;
    let containerDimensions = this.getContainerDimensions();
    let widthRatio = width/containerDimensions.width;
    let heightRatio = height/containerDimensions.height;
    if (widthRatio < heightRatio) {
      return 'auto';
    } else {
      return containerDimensions.height;
    }
  }
  */



}
