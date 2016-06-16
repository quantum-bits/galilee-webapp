import { Component, OnInit } from '@angular/core';

import { ReadingService } from './reading.service';
import { Reading } from './reading';
import { PracticeService } from './practice.service';
import { Practice } from './practice';


@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  providers: [ReadingService, PracticeService],
  directives: [],
})
export class AppComponent implements OnInit {
  title = 'app works!';

  date: Date;
  readings: Reading[] = [];
  practices: Practice[] = [];
  singleReading: Reading;

  public landingPage = true;
  public detailsPage = false;
  public managePage = false;

  constructor(
    private readingService: ReadingService,
    private practiceService: PracticeService){
  }

  ngOnInit() {
    this.date = new Date();
    // FIXME hardcoded readings
    this.readingService.getTodaysReadings().then(
      (readings) => {
        this.readings = readings;
      }
    );
    this.readingService.getSingleReading().then(
      (reading) => {
        this.singleReading = reading;
      }
    );
    this.practiceService.getPractices().then(
      (practices) => {
        this.practices = practices;
      }
    );

  }

  gotoDetails() {
    this.detailsPage = true;
    this.managePage = false;
    this.landingPage = false;
  }

  goBack(){
    this.detailsPage = false;
    this.managePage = false;
    this.landingPage = true;
  }

  gotoManage(){
    this.detailsPage = false;
    this.managePage = true;
    this.landingPage = false;
  }

}
