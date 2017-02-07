import { Component, OnInit, ViewChild } from '@angular/core';

import * as moment from 'moment';

import {IReading, ReadingDay} from '../../../shared/interfaces/reading.interface';
import {Application} from '../../../shared/interfaces/application.interface';

import {ReadingService} from '../../../shared/services/reading.service';
import {CalendarEntries} from '../../../shared/interfaces/calendar-entries.interface';
import {DailyQuestion} from '../../../shared/interfaces/reading.interface';

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
    if (dateString in this.calendarReadings) {
      console.log('we have data, fetching....');
      this.fetchReadings(dateString);
    } else {
      console.log('no data for this date');
      this.readingsData = null;
      this.questions = null;
    }
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
        }
      );
  }

}
