import { Component, OnInit, ViewChild } from '@angular/core';

import * as moment from 'moment';

import {IReading, ReadingDay} from '../../../shared/interfaces/readings.interface';
import {Application} from '../../../shared/interfaces/application.interface';

import {ReadingService} from '../../../shared/services/reading.service';
import {CalendarEntries} from '../../../shared/interfaces/calendar-entries.interface';
import {DailyQuestion} from '../../../shared/interfaces/readings.interface';

@Component({
  selector: 'app-update-readings',
  templateUrl: './update-readings.component.html',
  styleUrls: ['./update-readings.component.css']
})
export class UpdateReadingsComponent implements OnInit {

  //@ViewChild('updatePractice') modal: UpdatePracticeFormComponent;

  private calendarReadings: CalendarEntries = {};
  private readingsData: ReadingDay = null;
  private dateString: string = null;
  private questions: Array<DailyQuestion> = [];

  private reading: IReading = null;

  //private readingID: number;
  //private application: Application;

  private dateStringCalendarInit = moment(new Date()).format('YYYY-MM-DD');

  constructor(
    private readingService: ReadingService){}
    //},
    //private practiceService: PracticeService) { }

  ngOnInit() {
    //this.fetchPractices();

    this.readingService.getReadingMetadata()
      .subscribe(
        calendarReadings => {
          console.log(calendarReadings);
          this.calendarReadings = calendarReadings;
        },
        error => {
          console.log('error: ', error);
        }
      );
  }

  daySelected(dateString: string) {
    // do something....
    console.log('dateString: ', dateString);
    this.dateString = dateString;
    //this.fetchReadings()
    this.fetchReadings(dateString);
  }

  fetchReadings(dateString: string) {
    this.readingService.fetchSavedReadings(dateString)
      .subscribe(
        readings => {
          this.readingsData = readings;
          console.log('READINGS: ', this.readingsData);
          if ('questions' in this.readingsData){
            this.questions = this.readingsData.questions;
          }
        },
        error => {
          //this.modal.openModal();
          console.log('error: ', error);
          this.readingsData = null;
          this.questions = null;
          /*
          if 404 error, immediately create a new readingDay object
          in the database, wait for the reply, and then set readingsData to the response;
          then it will be ready for posting questions/readings, etc.
           */


        }
      );
  }

}
