import { Component, OnInit, ViewChild } from '@angular/core';

import * as moment from 'moment';

import {IReading, ReadingsData} from '../../../shared/interfaces/readings-data.interface';
import {Application} from '../../../shared/interfaces/application.interface';

import {ReadingService} from '../../../shared/services/reading.service';
//import {PracticeService} from '../../../shared/services/practice.service';

//import {UpdatePracticeFormComponent} from '../update-practice-form/update-practice-form.component';

import {CalendarEntries} from '../../../shared/interfaces/calendar-entries.interface';


@Component({
  selector: 'app-update-readings',
  templateUrl: './update-readings.component.html',
  styleUrls: ['./update-readings.component.css']
})
export class UpdateReadingsComponent implements OnInit {

  //@ViewChild('updatePractice') modal: UpdatePracticeFormComponent;

  private calendarReadings: CalendarEntries = {};
  private readingsData: ReadingsData = null;
  private dateString: string = null;
  private questions: string[] = null;
  private addReadingModeOn: boolean = false;
  private addQuestionModeOn: boolean = false;
  private addPracticeModeOn: boolean = false;

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

  addNewReading(){
    this.reading = null;
    this.addReadingModeOn = true;
  }

  onAddReading(success: boolean){
    console.log('succes?', success);
    this.addReadingModeOn = false;
  }

  addNewQuestion(){
    this.reading = null;
    this.addQuestionModeOn = true;
  }

  onAddQuestion(success: boolean){
    console.log('success?', success);
    this.addQuestionModeOn = false;
  }

  /*
  onLaunchAddPracticeForm(readingIndex: number){
    // readingIndex is the index in the array of readings
    console.log('TIME TO LAUNCH THE PRACTICE FORM!!! READING: ', readingIndex);
    this.application = null;
    this.readingID = this.readingsData.readings[readingIndex].id;
    this.addPracticeModeOn = true;
    this.modal.openModal();
  }
  */

  /*
  onAddPractice(success: boolean){
    console.log('succes?', success);
    this.addPracticeModeOn = false;
  }
  */

}
