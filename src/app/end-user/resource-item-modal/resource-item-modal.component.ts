import { Component, OnInit, Input, ViewChild, EventEmitter, ElementRef } from '@angular/core';

import {MaterializeAction} from 'angular2-materialize';

@Component({
  selector: 'app-resource-item-modal',
  templateUrl: './resource-item-modal.component.html',
  styleUrls: ['./resource-item-modal.component.scss']
})
export class ResourceItemModalComponent implements OnInit {

  @Input() resources: any = null;
  @ViewChild('imageContainer') imageElement: ElementRef;

  modalActions = new EventEmitter<string|MaterializeAction>();

  constructor() { }

  ngOnInit() {
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

  /*
  The following provides some useful ways to determine the size of the
  viewport:
   https://stackoverflow.com/questions/1248081/get-the-browser-viewport-dimensions-with-javascript
   */
  getContainerDimensions() {
    let computedStyle = window.getComputedStyle(this.imageElement.nativeElement,null);
    console.log(computedStyle);
    let width = this.pxToNumber(computedStyle.width);
    let height = this.pxToNumber(computedStyle.height);

    //this.imageElement.nativeElement.style.setProprety('background-color', 'blue', 'important');

    width = this.pxToNumber(computedStyle.width);
    height = this.pxToNumber(computedStyle.height);

    // TODO: apparently the following is undefined in IE8; is this an issue?!?
    let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    console.log('width, w: ', width, w);
    console.log('height, h: ', height, h);

    //return {width: width, height: height};

  }


  computeModalDimensions() {
    // TODO: apparently the following is undefined in IE8; is this an issue?!?
    let viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    let maxWidth = 0.95*viewportWidth;
    let maxHeight = 0.95*viewportHeight;

    let viewportAspectRatio = maxWidth/maxHeight;

    // TODO: FIX THIS!!!  Hard-coding the 0th image here....
    let width = this.resources[2].imageWidth;
    let height = this.resources[2].imageHeight;

    let imageAspectRatio = width/height;

    console.log('viewport: max width, max height:', maxWidth, maxHeight);
    console.log('image: max width, max height:', width, height);

    if (imageAspectRatio > viewportAspectRatio) {
      // set image width to the full width available
      //console.log('iAR > vpAR...width: ', this.numberToPx(maxWidth));
      return {
        width: this.numberToPx(maxWidth),
        height: this.numberToPx(height*maxWidth/width),
        top: this.numberToPx((viewportHeight-height*maxWidth/width)/2)
      };

    } else {
      return {
        width: this.numberToPx(width*maxHeight/height),
        height: this.numberToPx(maxHeight),
        top: this.numberToPx((viewportHeight-maxHeight)/2)
      };
    }
  }


  getWidth() {
    return this.computeModalDimensions().width;
  }

  getHeight() {
    return this.computeModalDimensions().height;
  }

  getTop() {
    console.log('top: ', this.computeModalDimensions().top);
    console.log(typeof this.computeModalDimensions().top);
    return this.computeModalDimensions().top;
  }

  openModal() {
    // note that we open the modal programmatically upon initialization
    // (from within the template); see: https://github.com/InfomediaLtd/angular2-materialize/issues/209
    this.modalActions.emit({action:"modal",params:['open']});
  }

  closeModal() {
    this.modalActions.emit({action:"modal",params:['close']});
  }

  cancel() {
    // could close the modal directly here, but need to both close
    // the modal and delete the component itself, so we let the
    // manage-users component take care of everything....
    //let refreshUsers: boolean = false;
    //this.userService.announceCloseAndCleanUp(refreshUsers);
    this.closeModal();//TODO: FIX THIS
  }

}
