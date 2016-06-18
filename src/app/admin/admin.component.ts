import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { PracticeService } from '../shared/services/practice.service';
import { Practice } from '../shared/models/practice';
import { ReadingService } from '../shared/services/reading.service';
import { Reading } from '../shared/models/reading';


@Component({
  moduleId: module.id,
  selector: 'app-admin',
  templateUrl: 'admin.component.html',
  styleUrls: ['admin.component.css'],
  providers: [ReadingService, PracticeService],
  directives: [ROUTER_DIRECTIVES],

})
export class AdminComponent implements OnInit {

  date: Date;
  readings: Reading[] = [];
  practices: Practice[] = [];

  constructor(
    private practiceService: PracticeService,
    private readingService: ReadingService) {
  }

  ngOnInit() {
    this.date = new Date();
    // FIXME hardcoded readings
    this.readingService.getTodaysReadings().then(
      (readings) => {
        this.readings = readings;
      }
    );
    this.practiceService.getPractices().then(
      (practices) => {
        this.practices = practices;
      }
    );

  }

}
