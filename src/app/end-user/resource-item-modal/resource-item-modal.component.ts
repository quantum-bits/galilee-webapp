import { Component, OnInit, Input, ViewChild, EventEmitter, ElementRef } from '@angular/core';

import {MaterializeAction} from 'angular2-materialize';

import { ResourceModalCommunicationService } from '../resource-list/resource-modal-communication.service';

@Component({
  selector: 'app-resource-item-modal',
  templateUrl: './resource-item-modal.component.html',
  styleUrls: ['./resource-item-modal.component.scss']
})
export class ResourceItemModalComponent implements OnInit {

  @Input() resources: any = null;
  @Input() currentIndex: number = 0;
  @ViewChild('imageContainer') imageElement: ElementRef;

  modalActions = new EventEmitter<string|MaterializeAction>();
  showInfo: boolean = true;

  constructor(private resourceModalCommunicationService: ResourceModalCommunicationService) { }

  ngOnInit() {
  }

  toggleShowInfo() {
    this.showInfo = !this.showInfo;
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

    let maxWidth = Math.min(0.95*viewportWidth, viewportWidth - 100); // to make sure there is room for the 'close' icon
    let maxHeight = 0.95*viewportHeight;

    let viewportAspectRatio = maxWidth/maxHeight;

    let width = this.resources[this.currentIndex].imageWidth;
    let height = this.resources[this.currentIndex].imageHeight;

    let imageAspectRatio = width/height;

    //console.log('viewport: max width, max height:', maxWidth, maxHeight);
    //console.log('image: max width, max height:', width, height);

    let modalData: any;
    if (imageAspectRatio > viewportAspectRatio) {
      // set image width to the full width available
      //console.log('iAR > vpAR...width: ', this.numberToPx(maxWidth));
      modalData = {
        width: maxWidth,
        height: height*maxWidth/width
      };

    } else {
      modalData = {
        width: width*maxHeight/height,
        height: maxHeight
      };
    }

    modalData.top = (viewportHeight - modalData.height)/2;

    if (imageAspectRatio > 1) {
      // put the info box on the right half
      modalData.infoBoxWidth = modalData.width/2;//margin is 10 px
      modalData.infoBoxHeight = modalData.height;
      modalData.infoBoxTop = 0;
      modalData.infoBoxLeft = modalData.width/2;
    } else {
      // put the info box at the bottom
      modalData.infoBoxWidth = modalData.width;//margin is 10 px
      modalData.infoBoxHeight = modalData.height/2;
      modalData.infoBoxTop = modalData.height/2;
      modalData.infoBoxLeft = 0;
    }

    for (let key in modalData) {
      modalData[key] = this.numberToPx(modalData[key]);
    }
    return modalData;
  }


  getWidth() {
    return this.computeModalDimensions().width;
  }

  getHeight() {
    return this.computeModalDimensions().height;
  }

  getTop() {
    //console.log('top: ', this.computeModalDimensions().top);
    //console.log(typeof this.computeModalDimensions().top);
    return this.computeModalDimensions().top;
  }

  getInfoBoxWidth() {
    return this.computeModalDimensions().infoBoxWidth;
  }

  getInfoBoxHeight() {
    return this.computeModalDimensions().infoBoxHeight;
  }

  getInfoBoxTop() {
    return this.computeModalDimensions().infoBoxTop;
  }

  getInfoBoxLeft() {
    return this.computeModalDimensions().infoBoxLeft;
  }

  openModal() {
    // note that we open the modal programmatically upon initialization
    // (from within the template); see: https://github.com/InfomediaLtd/angular2-materialize/issues/209
    this.modalActions.emit({action:"modal",params:['open']});
  }

  closeModal() {
    //console.log('received message to close the modal....');
    this.modalActions.emit({action:"modal",params:['close']});
  }

  cancel() {
    // could close the modal directly here, but need to both close
    // the modal and delete the component itself, so we let the
    // resource-list component take care of everything....
    //console.log('click registered...hitting the service');
    this.resourceModalCommunicationService.announceModalClosed();
  }

}
