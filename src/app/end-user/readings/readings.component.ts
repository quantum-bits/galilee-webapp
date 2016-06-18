import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { ReadingService } from '../../shared/services/reading.service';
import { Reading } from '../../shared/models/reading';

@Component({
  moduleId: module.id,
  selector: 'app-readings',
  templateUrl: 'readings.component.html',
  styleUrls: ['readings.component.css'],
  providers: [ReadingService],
  directives: [ROUTER_DIRECTIVES],
})
export class ReadingsComponent implements OnInit {

  date: Date;
  readings: Reading[] = [];

  constructor(
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

