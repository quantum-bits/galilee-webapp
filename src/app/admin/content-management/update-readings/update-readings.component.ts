import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';

import {IReading, ReadingsData} from '../../../shared/interfaces/readings-data.interface';

import {ReadingService} from '../../../shared/services/reading.service';
import {CalendarEntries} from '../../../shared/interfaces/calendar-entries.interface';

@Component({
  selector: 'app-update-readings',
  templateUrl: './update-readings.component.html',
  styleUrls: ['./update-readings.component.css']
})
export class UpdateReadingsComponent implements OnInit {

  private calendarReadings: CalendarEntries = null;
  private readingsData: ReadingsData = null;
  private dateString: string = null;
  private questions: string[] = null;
  private addReadingModeOn: boolean = false;
  private addQuestionModeOn: boolean = false;

  private reading: IReading = null;

  private dateStringCalendarInit = moment(new Date()).format('YYYY-MM-DD');

  constructor(private readingService: ReadingService) { }

  ngOnInit() {
    this.readingService.fetchCalendarReadings()
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

  addNewReading(){
    this.reading = null;
    this.addReadingModeOn = true;
  }

  onAddReading(success: boolean){
    console.log('succes!!');
    this.addReadingModeOn = false;
  }


}
