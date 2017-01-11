import {Component, OnInit} from '@angular/core';
//import { ROUTER_DIRECTIVES } from '@angular/router';
import {Router, ActivatedRoute} from '@angular/router';

import {ReadingService} from '../../shared/services/reading.service';
import {PracticeService} from '../../shared/services/practice.service';
import {Reading} from '../../shared/models/reading.model';
//import { ReadingItemComponent } from '../reading-item';
//import { PracticeItemComponent } from '../practice-item';

@Component({
  selector: 'app-reading-practice',
  templateUrl: './reading-practice.component.html',
  providers: [PracticeService]
})
export class ReadingPracticeComponent implements OnInit {

  date: Date;
  //singleReading: Reading; // once the format for the returned data has been finalized, we should use this
  singleReading: any;
  practice: any;
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
      let dateString = params['dateString'];
      let readingID = +params['readingID'];
      let practiceID = +params['practiceID'];// eventually also need to fetch the step
      console.log(readingID);
      console.log(practiceID);
      if (this.readingService.stepExists(readingID, practiceID, 0)) {
        console.log('looks like step exists');
        this.singleReading = this.readingService.fetchSavedReading(readingID);
        this.practice = this.singleReading.applications[practiceID].practice;
      } else {
        // modal error message or something
      }
      console.log(this.singleReading);

    })
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

  fetchPractice(reading, practiceID) {
    for (let practice of reading.practices) {
      if (practice.id === practiceID) {
        this.practice = practice;
      }
    }
  }

}



