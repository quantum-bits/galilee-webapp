import { Component, Inject, OnInit, Input, EventEmitter, ViewChild } from '@angular/core';
import {Router} from '@angular/router';

//import { FacebookService, UIParams, UIResponse } from 'ngx-facebook';
//import { FacebookService, LoginResponse, LoginOptions, UIResponse, UIParams, FBVideoComponent } from 'ngx-facebook';

import {FBShareComponent} from 'ngx-facebook';


import { DOCUMENT } from '@angular/platform-browser';

//import {MaterializeAction} from "angular2-materialize"

//declare var $: any; // for using jQuery within this angular component

declare var window: any;

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

  safeUrl: string = '';


  //https://stackoverflow.com/questions/37796449/how-to-get-the-current-url-in-the-browser-in-angular-2-using-typescript
  constructor(private router: Router,
              //private fb: FacebookService,
              @Inject(DOCUMENT) public document: any) {
    console.log(this.document.location.href);
    this.safeUrl = 'https://galilee.cse.taylor.edu';
    //this.safeUrl = 'href=https%3A%2F%2Fgalilee.cse.taylor.edu';
    //this.fbSrc = "https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2F"+document.location.href+"u&layout=button&size=large&mobile_iframe=true&width=73&height=28&appId";
  }


  ngOnInit() {
    //https://github.com/zyra/ngx-facebook/issues/74
    console.log('inside OnInit!!!!!!');
    window.FB.XFBML.parse();
  }

  /*
  ngAfterViewChecked() {
    window.FB.XFBML.parse();
  }
  */

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

/*
  initializeStepper(){
    $('.carousel.carousel-slider').carousel({fullWidth: true});
    //$('.stepper').activateStepper();
  }
*/



/*
  share(url: string) {

    let params: UIParams = {
      href: 'https://github.com/zyra/ngx-facebook',
      method: 'share'
    };

    this.fb.ui(params)
      .then((res: UIResponse) => console.log(res))
      .catch((e: any) => console.error(e));

  }
  */




}
