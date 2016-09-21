import { Component, OnInit } from '@angular/core';
//import { ROUTER_DIRECTIVES } from '@angular/router';
//import { Router, ActivatedRoute } from '@angular/router';

import { ReadingService } from '../../shared/services/reading.service';
import { Reading } from '../../shared/models/reading.model';
//import { ReadingItemComponent } from '../reading-item';

@Component({
  selector: 'app-readings',
  templateUrl: 'readings.component.html',
  styleUrls: ['readings.component.css'],
  providers: [ReadingService]
})
export class ReadingsComponent implements OnInit {

  // NOTE: to add a modal-type of full view for images, do the following:
  // https://github.com/InfomediaLtd/angular2-materialize/issues/88
  // http://materializecss.com/media.html
  // In particular....
  //ngAfterViewInit(){
  //  $('.materialboxed').materialbox();
  //}

  date: Date;
  readings: Reading[] = [];
  includeBackButton = false;

  constructor(
    //private router: Router,
    private readingService: ReadingService){
  }

  ngOnInit() {
    this.date = new Date();
    // FIXME hardcoded readings
    this.readingService.getTodaysReadings().then(
      (readings) => {
        this.readings = readings;
      }
    );

  }

}

