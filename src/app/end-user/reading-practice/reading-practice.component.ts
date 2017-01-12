import {Component, OnInit, ViewChild} from '@angular/core';
//import { ROUTER_DIRECTIVES } from '@angular/router';
import {Router, ActivatedRoute} from '@angular/router';

import {ReadingService} from '../../shared/services/reading.service';
import {PracticeService} from '../../shared/services/practice.service';
import {Reading} from '../../shared/models/reading.model';

import {SimpleModalComponent} from "../readings/simple-modal.component";

@Component({
  selector: 'app-reading-practice',
  templateUrl: './reading-practice.component.html',
  styleUrls: ['./reading-practice.component.css'],
  providers: [PracticeService]
})
export class ReadingPracticeComponent implements OnInit {

  @ViewChild('sorry') modal: SimpleModalComponent;

  date: Date;
  //singleReading: Reading; // once the format for the returned data has been finalized, we should use this
  readingsData: any;
  singleReading: any;
  displaySummary: boolean; //if true, display the summary for the practice
  displayPreparation: boolean; //if true, display the Preparation page
  displayStep: boolean; //if true, display a step

  dateString: string;
  readingIndex: number;
  practiceIndex: number;
  stepIndex: number; // the index of the step to be displayed (if, in fact, a step is to be displayed)

  practiceData: any;
  practiceGeneralInformation: any;
  includeBackButton = true;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private readingService: ReadingService) {
    console.log('inside constructor for reading-practice');
  }

  ngOnInit() {
    console.log('inside ngOnInit for reading-practice');
    this.route.params.subscribe(params => {
      this.initializeDisplayVariables();
      console.log('received route params');
      this.dateString = params['dateString'];
      this.readingIndex = +params['readingIndex'];
      this.practiceIndex = +params['practiceIndex'];// eventually also need to fetch the step
      //http://stackoverflow.com/questions/1098040/checking-if-a-key-exists-in-a-javascript-object
      if ("stepIndex" in params) {
        this.stepIndex = +params['stepIndex'];
        this.displayStep = true;
        //this.displayStep = true; // display a step of the practice, not the summary
      } else {
        // TODO: eventually check the readings array to see whether or not
        // to display the summary for the given practice; if not, just display
        // the preparation page
        this.displaySummary = true; // display the summary for the practice
      }
      console.log(params);
      console.log(this.readingIndex);
      console.log(this.practiceIndex);
      // next, fetch the entire readingsData object from the service;
      // it'd probably be better to fetch only what we need for this component,
      // but we need the flexibility to either fetch saved data or
      // go to the db and re-fetch the data.  In the latter case, it's not obvious
      // to me how the service could intercept the transmission and parse out
      // only the required reading, etc.  One option would be to write an API endpoint
      // for this, but for now we're just sending the whole works over
      // in either case.
      this.readingService.fetchSavedReadings(this.dateString)
        .subscribe(
          readingsData => {
            this.readingsData = readingsData;

            console.log(this.readingsData);

            // now check if the required reading/practice/step exists, and display
            // the page (or an error message)
            if (this.practiceExists(this.readingsData, this.readingIndex, this.practiceIndex)) {
              if (!this.displayStep) {
                this.practiceData = this.readingsData.readings[this.readingIndex].applications[this.practiceIndex];
              } else {
                let pD = this.readingsData.readings[this.readingIndex].applications[this.practiceIndex];
                if (this.stepIndex >= 0 && this.stepIndex < pD.steps.length) {
                  // good to go....
                  this.practiceData = pD;
                } else {
                  // oops -- the requested step doesn't exist
                  this.modal.openModal();
                }
              }
            } else {
              this.modal.openModal();
            }
          },
          error => {
            this.modal.openModal();
          }
        );

    })
  }

  practiceExists(readingsData, readingIndex, practiceIndex){
    // checks if the requested reading/practice exists in readingsData
    if (readingIndex >= this.readingsData.length) {
      return false;
    } else if (practiceIndex >= this.readingsData.readings[readingIndex].applications.length) {
      return false;
    } else {
      return true;
    }
  }

  goHome(){
    this.router.navigate(['/end-user/readings', this.dateString]);
  }

  initializeDisplayVariables(){
    this.displaySummary = false;
    this.displayPreparation = false;
    this.displayStep = false;
  }

  launchPreparationPage(turnOffSummary: boolean){
    console.log('turn off summary?');
    console.log(turnOffSummary);
    if (turnOffSummary){
      // turn off the summary for this practice in the db (so that the user won't see this summary in the future)
    }
    this.displaySummary = false;
    this.displayPreparation = true;
  }

}



