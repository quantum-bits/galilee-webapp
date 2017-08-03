import { Component, OnInit, OnDestroy, Input, ViewChild, EventEmitter, ComponentFactoryResolver, ElementRef } from '@angular/core';

import {Subscription} from 'rxjs/Subscription';

import {MaterializeAction} from "angular2-materialize"

import {ResourceItemModalComponent} from '../resource-item-modal/resource-item-modal.component';
import { ResourceItemModalAnchorDirective } from '../resource-list/resource-item-modal-anchor.directive';
import { ResourceModalCommunicationService } from '../resource-list/resource-modal-communication.service';

declare var $: any; // for using jQuery within this angular component

@Component({
  selector: 'app-resource-list',
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.scss']
})
export class ResourceListComponent implements OnInit, OnDestroy {

  //TODO: use the Resources type
  @Input() resources: any = null;

  //@ViewChild('carousel') carouselElement; // not currently being used
  @ViewChild('carouselSlider') carouselElement: ElementRef;
  @ViewChild(ResourceItemModalAnchorDirective) resourceItemModalAnchor: ResourceItemModalAnchorDirective;

  //actions = new EventEmitter<string>(); // not currently being used

  //innerHtml

  carouselCycled(curr_item, dragged) {
    // jQuery: 'data-carousel-index' in the template is connected to 'carousel-index' here
    let curr_index = curr_item.data('carousel-index');
    console.log("carousel cycled to index", curr_index);
  }

  private subscription: Subscription;
  showInitialized = false;

  private modalComponent: any;

  /*
   imageDimensions = {
   smallViewPort: {
   maxWidth: 200,
   maxHeight: 350
   },
   medViewPort: {
   maxWidth: 300,
   maxHeight: 350
   },
   largeViewPort: {
   maxWidth: 400,
   maxHeight: 400
   },

   }
   */



  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private resourceModalCommunicationService: ResourceModalCommunicationService) {
    this.subscription = this.resourceModalCommunicationService.modalClosed$.subscribe(
      () => {
        //console.log('received word from modal...!  Closing....');
        this.modalCloseAndCleanUp();
      });
  }

  ngOnInit() {
    //this.initializeCarousel();
  }

  logDimensions() {
    console.log('carouselElement: ', this.carouselElement.nativeElement.offsetWidth);
    console.log('carouselElement: ', this.carouselElement.nativeElement.offsetHeight);
    console.log(this.carouselElement.nativeElement.getBoundingClientRect());
    console.log(window.getComputedStyle(this.carouselElement.nativeElement,null));
    let computedStyle = window.getComputedStyle(this.carouselElement.nativeElement,null);
    let padding = this.pxToNumber(computedStyle.paddingLeft)+this.pxToNumber(computedStyle.paddingRight);
    let width = this.pxToNumber(computedStyle.width);
    let height = this.pxToNumber(computedStyle.height);
    console.log( padding, width, height);
    let imageWidth = width-padding;
    console.log('imageWidth: ', imageWidth);


    // now get image width and height


  }

  pxToNumber(val: string) {
    // extracts a numeric value from a string such as '10.875px'
    let parsedArray = val.split('px');
    return +parsedArray[0];
  }

  getContainerDimensions() {
    let computedStyle = window.getComputedStyle(this.carouselElement.nativeElement,null);
    let width = this.pxToNumber(computedStyle.width);
    let height = this.pxToNumber(computedStyle.height);
    return {width: width, height: height};
  }

  /*
  hasPreviousResource(i: number) {
    return i>0;
  }

  hasNextResource(i: number) {
    return i < this.resources.length-1;
  }
  */

  /*
  determineWidth(i: number, maxWidth: number, maxHeight: number) {
    console.log('max width is: ', maxWidth);
    let width = this.resources[i].imageWidth;
    let height = this.resources[i].imageHeight;
    let widthRatio = width/maxWidth;
    let heightRatio = height/maxHeight;
    if ((widthRatio <= 1 && heightRatio <= 1) || (widthRatio > heightRatio)) {
      return maxWidth;
    } else {
      return width/heightRatio;
    }

  }

  determineHeight(i: number, maxWidth: number, maxHeight: number) {
    let width = this.resources[i].imageWidth;
    let height = this.resources[i].imageHeight;
    let widthRatio = width/maxWidth;
    let heightRatio = height/maxHeight;
    console.log('width ratio: ', widthRatio);
    console.log('height ratio: ', heightRatio);
    if ((widthRatio <= 1 && heightRatio <= 1) || (widthRatio < heightRatio)) {
      return maxHeight;
    } else {
      return height/widthRatio;
    }
  }

*/


  determineWidth(i: number) {
    let width = this.resources[i].imageWidth;
    let height = this.resources[i].imageHeight;
    let containerDimensions = this.getContainerDimensions();
    let widthRatio = width/containerDimensions.width;
    let heightRatio = height/containerDimensions.height;
    if (widthRatio < heightRatio) {
      return containerDimensions.width;
    } else {
      return 'auto';
    }
  }

  determineHeight(i: number) {
    let width = this.resources[i].imageWidth;
    let height = this.resources[i].imageHeight;
    let containerDimensions = this.getContainerDimensions();
    let widthRatio = width/containerDimensions.width;
    let heightRatio = height/containerDimensions.height;
    if (widthRatio < heightRatio) {
      return 'auto';
    } else {
      return containerDimensions.height;
    }
  }

  openResourceModal() {
    this.resourceItemModalAnchor.viewContainer.clear();
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(ResourceItemModalComponent);
    this.modalComponent = this.resourceItemModalAnchor.viewContainer.createComponent(componentFactory).instance;
    this.modalComponent.resources = this.resources;
  }

  modalCloseAndCleanUp(){
    // close the modal and then clear the viewContainer
    //console.log('sending message to close modal');
    this.modalComponent.closeModal();
    //console.log('clearing view container');
    this.resourceItemModalAnchor.viewContainer.clear();
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

  /*
  initializeCarousel(){
    $('.carousel-slider').carousel({
      onCycleTo: function () {
        //do what needs to be done in here ...
        console.log('slid!');
      }
    });
  }
  */



}
