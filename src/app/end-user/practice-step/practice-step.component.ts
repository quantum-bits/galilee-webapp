import { Component, OnInit, Input, EventEmitter, ViewChild } from '@angular/core';
import {Router} from '@angular/router';

import {MaterializeAction} from "angular2-materialize"

declare var $: any; // for using jQuery within this angular component

@Component({
  selector: 'app-practice-step',
  templateUrl: './practice-step.component.html',
  styleUrls: ['./practice-step.component.css']
})
export class PracticeStepComponent implements OnInit {

  @Input() practiceData: any;
  @Input() dateString: string;
  @Input() readingIndex: number;
  @Input() practiceIndex: number;
  @Input() stepIndex: number;


  @ViewChild('carousel') carouselElement;
  actions = new EventEmitter<string>();

  imageURLs = [
    "https://image.shutterstock.com/display_pic_with_logo/1264645/364153082/stock-photo-asian-girl-in-sunflower-field-364153082.jpg",
    "https://image.shutterstock.com/display_pic_with_logo/1264645/298927574/stock-photo-a-young-traveler-girl-sit-on-the-wooden-bridge-in-halong-bay-and-enjoy-the-beauty-of-seascape-298927574.jpg",
    "https://image.shutterstock.com/display_pic_with_logo/1264645/298757792/stock-photo-a-young-traveler-girl-sit-on-the-top-of-mountain-in-halong-bay-and-enjoy-the-beauty-of-seascape-298757792.jpg",
    "https://image.shutterstock.com/display_pic_with_logo/2565601/411902890/stock-photo-ha-long-bay-scenic-view-hanoi-vietnam-411902890.jpg",
    "https://image.shutterstock.com/display_pic_with_logo/2565601/413207668/stock-photo-the-temple-of-literature-in-hanoi-vietnam-the-chinese-words-is-poem-of-thie-temple-and-templs-s-413207668.jpg"
  ];

  showInitialized = false;



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

  constructor(private router: Router) { }

  ngOnInit() {
  }

  includeNavigationButtons() {
    return this.showPreviousButton() || this.showNextButton();
  }

  showPreviousButton() {
    if (this.stepIndex > 0) {
      return true;
    } else {
      return false;
    }
  }

  showNextButton() {
    if (this.stepIndex < this.practiceData.steps.length-1) {
      return true;
    } else {
      return false;
    }
  }

  nextStep() {
    console.log('going to next step....');
    this.router.navigate(['/end-user/reading-practice', this.dateString, this.readingIndex, this.practiceIndex, this.stepIndex +1]);
  }

  previousStep() {
    this.router.navigate(['/end-user/reading-practice', this.dateString, this.readingIndex, this.practiceIndex, this.stepIndex -1]);
  }

  hasPreviousResource(i: number) {
    return i>0;
  }

  hasNextResource(i: number) {
    return i < this.practiceData.steps[this.stepIndex].resources.length-1;
  }

  determineWidth(i: number, maxWidth: number, maxHeight: number) {
    console.log('max width is: ', maxWidth);
    let width = this.practiceData.steps[this.stepIndex].resources[i].imageWidth;
    let height = this.practiceData.steps[this.stepIndex].resources[i].imageHeight;
    let widthRatio = width/maxWidth;
    let heightRatio = height/maxHeight;
    if ((widthRatio <= 1 && heightRatio <= 1) || (widthRatio > heightRatio)) {
      return maxWidth;
    } else {
      return width/heightRatio;
    }

  }

  determineHeight(i: number, maxWidth: number, maxHeight: number) {
    let width = this.practiceData.steps[this.stepIndex].resources[i].imageWidth;
    let height = this.practiceData.steps[this.stepIndex].resources[i].imageHeight;
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



  initializeStepper(){
    $('.carousel.carousel-slider').carousel({fullWidth: true});
    //$('.stepper').activateStepper();
  }




}
