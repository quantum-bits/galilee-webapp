import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';

import {IReading, ReadingsData} from '../../../shared/interfaces/readings-data.interface';
import {Application} from '../../../shared/interfaces/application.interface';

import {ReadingService} from '../../../shared/services/reading.service';
import {PracticeService} from '../../../shared/services/practice.service';


import {CalendarEntries} from '../../../shared/interfaces/calendar-entries.interface';

const PRACTICE_GENERAL_INFO = [
  {
    id: 10,
    title: 'Lectio Divina',
    information: "There is nothing new about Scripture engagement! As I hope you’ve seen, Scripture engagement is thoroughly taught in the Scriptures. Christians have been developing and practicing various Scripture engagement techniques for hundreds of years. The goal of this website is not to introduce you to some new means of connecting with God. Our hope is to train people in tried and true methods of experiencing God through the Bible. One Scripture engagement technique that has a long and rich history, and that has been experiencing resurgence in recent years, is lectio divina."
  },
  {
    id: 9,
    title:      'Praying Scripture',
    information: 'Here is some general information about praying scripture.  Praesent ac velit ac mi tincidunt molestie sit amet eu dolor. Duis sit amet est ligula. Aliquam bibendum maximus elit eget tincidunt. Proin non semper dui. Integer nec consequat nunc, et tincidunt risus. Fusce imperdiet id ligula eu bibendum. Curabitur venenatis dui et augue tincidunt, sit amet ultricies elit ultricies. Vestibulum a gravida nulla. Nam blandit, lacus eu commodo pretium, ex eros tincidunt odio, sed aliquet libero metus in justo. Nam in nunc justo. Nam pulvinar convallis placerat. Ut non molestie mi, nec cursus eros. Proin gravida rhoncus placerat.'
  },
  {
    id: 12,
    title:      'Journaling Scripture',
    information: 'Here is some general information about journaling scripture.  Praesent ac velit ac mi tincidunt molestie sit amet eu dolor. Duis sit amet est ligula. Aliquam bibendum maximus elit eget tincidunt. Proin non semper dui. Integer nec consequat nunc, et tincidunt risus. Fusce imperdiet id ligula eu bibendum. Curabitur venenatis dui et augue tincidunt, sit amet ultricies elit ultricies. Vestibulum a gravida nulla. Nam blandit, lacus eu commodo pretium, ex eros tincidunt odio, sed aliquet libero metus in justo. Nam in nunc justo. Nam pulvinar convallis placerat. Ut non molestie mi, nec cursus eros. Proin gravida rhoncus placerat.'
  },
  {
    id: 11,
    title:      'Scripture Engagement through the Visual Arts',
    information: 'Here is some general information about memorizing scripture.  Praesent ac velit ac mi tincidunt molestie sit amet eu dolor. Duis sit amet est ligula. Aliquam bibendum maximus elit eget tincidunt. Proin non semper dui. Integer nec consequat nunc, et tincidunt risus. Fusce imperdiet id ligula eu bibendum. Curabitur venenatis dui et augue tincidunt, sit amet ultricies elit ultricies. Vestibulum a gravida nulla. Nam blandit, lacus eu commodo pretium, ex eros tincidunt odio, sed aliquet libero metus in justo. Nam in nunc justo. Nam pulvinar convallis placerat. Ut non molestie mi, nec cursus eros. Proin gravida rhoncus placerat.'
  },
  {
    id: 5,
    title:      'Dramatizing Scripture',
    information: 'Here is some general information about dramatizing scripture.  Praesent ac velit ac mi tincidunt molestie sit amet eu dolor. Duis sit amet est ligula. Aliquam bibendum maximus elit eget tincidunt. Proin non semper dui. Integer nec consequat nunc, et tincidunt risus. Fusce imperdiet id ligula eu bibendum. Curabitur venenatis dui et augue tincidunt, sit amet ultricies elit ultricies. Vestibulum a gravida nulla. Nam blandit, lacus eu commodo pretium, ex eros tincidunt odio, sed aliquet libero metus in justo. Nam in nunc justo. Nam pulvinar convallis placerat. Ut non molestie mi, nec cursus eros. Proin gravida rhoncus placerat.'
  },
  {
    id: 6,
    title:      'Singing Scripture',
    information: 'Here is some general information about singing scripture.  Praesent ac velit ac mi tincidunt molestie sit amet eu dolor. Duis sit amet est ligula. Aliquam bibendum maximus elit eget tincidunt. Proin non semper dui. Integer nec consequat nunc, et tincidunt risus. Fusce imperdiet id ligula eu bibendum. Curabitur venenatis dui et augue tincidunt, sit amet ultricies elit ultricies. Vestibulum a gravida nulla. Nam blandit, lacus eu commodo pretium, ex eros tincidunt odio, sed aliquet libero metus in justo. Nam in nunc justo. Nam pulvinar convallis placerat. Ut non molestie mi, nec cursus eros. Proin gravida rhoncus placerat.'
  }
];




@Component({
  selector: 'app-update-readings',
  templateUrl: './update-readings.component.html',
  styleUrls: ['./update-readings.component.css']
})
export class UpdateReadingsComponent implements OnInit {

  private calendarReadings: CalendarEntries = {};
  private readingsData: ReadingsData = null;
  private dateString: string = null;
  private questions: string[] = null;
  private addReadingModeOn: boolean = false;
  private addQuestionModeOn: boolean = false;
  private addPracticeModeOn: boolean = false;

  private reading: IReading = null;

  //TODO: fix!
  private availablePractices = PRACTICE_GENERAL_INFO;
  private readingID: number;
  private application: Application;

  private dateStringCalendarInit = moment(new Date()).format('YYYY-MM-DD');

  constructor(
    private readingService: ReadingService,
    private practiceService: PracticeService) { }

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

  fetchPractices(){
    this.practiceService.getPractices()
      .subscribe(
        practices => {
          console.log('PRACTICES: ', practices);
        }
      )
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

  onLaunchAddPracticeForm(readingIndex: number){
    // readingIndex is the index in the array of readings
    console.log('TIME TO LAUNCH THE PRACTICE FORM!!! READING: ', readingIndex);
    this.application = null;
    this.readingID = this.readingsData.readings[readingIndex].id;
    this.addPracticeModeOn = true;
  }

  onAddPractice(success: boolean){
    console.log('succes?', success);
    this.addPracticeModeOn = false;
  }


}
