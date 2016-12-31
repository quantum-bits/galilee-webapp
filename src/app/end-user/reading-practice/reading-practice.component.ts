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
  providers: [ReadingService, PracticeService]
})
export class ReadingPracticeComponent implements OnInit {

  date: Date;
  singleReading: Reading;
  practice: any;
  practiceGeneralInformation: any;
  includeBackButton = true;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private readingService: ReadingService,
              private practiceService: PracticeService) {
  }

  // NOTE: the following might not be the most efficient way to do this; it fetches
  // the entire reading, even it if only needs to refresh the practice for that reading;
  // in principle, once there has been one trip to the db, we wouldn't need to hit it again
  // just to refresh which practice is being looked at
  ngOnInit() {
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
  }

  fetchPractice(reading, practiceID) {
    for (let practice of reading.practices) {
      if (practice.id === practiceID) {
        this.practice = practice;
      }
    }
  }

}



