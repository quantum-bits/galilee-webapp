import {Component, OnInit, ViewChild} from '@angular/core';
//import { ROUTER_DIRECTIVES } from '@angular/router';
import {Router, ActivatedRoute} from '@angular/router';

import {ReadingService} from '../../shared/services/reading.service';
import {PracticeService} from '../../shared/services/practice.service';
import {Reading} from '../../shared/models/reading.model';

//import {PracticeSummaryComponent} from '../practice-summary';

//import { ReadingItemComponent } from '../reading-item';
//import { PracticeItemComponent } from '../practice-item';

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
  displayStep: boolean; //if false, then display the summary of a practice; if true, display a step

  dateString: string;
  readingIndex: number;
  practiceIndex: number;
  stepIndex: number; // the index of the step to be displayed (if, in fact, a step is to be displayed)

  practiceData: any;
  practiceGeneralInformation: any;
  includeBackButton = true;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private readingService: ReadingService,
              private practiceService: PracticeService) {
    console.log('inside constructor for reading-practice');
  }

  // NOTE: the following might not be the most efficient way to do this; it fetches
  // the entire reading, even it if only needs to refresh the practice for that reading;
  // in principle, once there has been one trip to the db, we wouldn't need to hit it again
  // just to refresh which practice is being looked at
  ngOnInit() {
    console.log('inside ngOnInit for reading-practice');
    this.route.params.subscribe(params => {
      console.log('received route params');
      this.dateString = params['dateString'];
      this.readingIndex = +params['readingIndex'];
      this.practiceIndex = +params['practiceIndex'];// eventually also need to fetch the step
      //http://stackoverflow.com/questions/1098040/checking-if-a-key-exists-in-a-javascript-object
      if ("stepIndex" in params) {
        this.stepIndex = +params['stepIndex'];
        this.displayStep = true; // display a step of the practice, not the summary
      } else {
        this.displayStep = false; // display the summary for the practice
      }
      console.log(params);
      console.log(this.readingIndex);
      console.log(this.practiceIndex);
      // next, fetch the entire readingsData object from the service;
      // it'd probably be better to fetch only what we need for this component,
      // but we have to have the flexibility to either fetch saved data or
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


  // if (stepIndex >= this.readingsData.readings[readingIndex].applications[practiceIndex].steps.length) {

  parseReadingPractice(){

  }

  goHome(){
    this.router.navigate(['/end-user/readings', this.dateString]);
  }








    /*
    We may need to go this route later in order to fetch back the user's "state"
    when they made a certain journal entry, but for now we will just make a synchronous
    method call on the Reading service, with the assumption that that service already
    has the required data in hand....

    this.date = new Date();
    this.route.params.subscribe(params => {
      let readingID = +params['readingID'];
      let practiceID = +params['practiceID'];
      console.log(practiceID);
      this.readingService.getReadingById(readingID)
        .subscribe(reading => {
            this.singleReading = reading;
            this.fetchPractice(this.singleReading, practiceID);
            this.practiceService.getPracticeGeneralInformation(practiceID)
              .subscribe(
                practice => {
                  this.practiceGeneralInformation = practice;
                  console.log(this.practiceGeneralInformation);
                }
              )
          }
        );
    });
    */
  /*
  fetchPractice(reading, practiceID) {
    for (let practice of reading.practices) {
      if (practice.id === practiceID) {
        this.practice = practice;
      }
    }
  }
  */

}



