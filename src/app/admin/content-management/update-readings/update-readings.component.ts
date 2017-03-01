import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { Subscription }   from 'rxjs/Subscription';

import * as moment from 'moment';

import {IReading, ReadingDay} from '../../../shared/interfaces/reading.interface';
import {Application} from '../../../shared/interfaces/application.interface';

import {ReadingService} from '../../../shared/services/reading.service';
import {ReadingDayService} from '../../../shared/services/reading-day.service';

import {CalendarEntries} from '../../../shared/interfaces/calendar-entries.interface';
import {DailyQuestion} from '../../../shared/interfaces/reading.interface';

@Component({
  selector: 'app-update-readings',
  templateUrl: './update-readings.component.html',
  styleUrls: ['./update-readings.component.css']
})
export class UpdateReadingsComponent implements OnInit, OnDestroy {

  //@ViewChild('updatePractice') modal: UpdatePracticeFormComponent;

  private calendarReadings: CalendarEntries = {};
  private readingsData: ReadingDay = null;
  private dateString: string = null;
  private questions: Array<DailyQuestion> = [];

  private reading: IReading = null;

  //private readingID: number;
  //private application: Application;

  private dateStringCalendarInit = moment(new Date()).format('YYYY-MM-DD');

  subscription: Subscription;

  constructor(
    private readingService: ReadingService,
    private readingDayService: ReadingDayService,
    private route: ActivatedRoute,
    private router: Router){
    this.subscription = this.readingService.updateReadingsRefresh$.subscribe(
      message => {
        console.log('received instructions to refresh!');
        if (this.dateString!==null){
          this.reloadPageData(this.dateString);
        }
      });
  }
    //},
    //private practiceService: PracticeService) { }

  ngOnInit() {
    this.readingService.getReadingMetadata()
      .subscribe(
        calendarReadings => {
          console.log(calendarReadings);
          this.calendarReadings = calendarReadings;
          this.route.params.subscribe(params => {
            console.log('update-readings -- received route params');
            if ('dateString' in params) {
              this.dateString = params['dateString'];
              this.fetchReadings(this.dateString);
            }
          });
        },
        error => {
          console.log('error: ', error);
        }
      );
  }

  reloadPageData(dateString: string){
    this.readingService.getReadingMetadata()
      .subscribe(
        calendarReadings => {
          console.log(calendarReadings);
          this.calendarReadings = calendarReadings;
          this.fetchReadings(dateString);
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
    if (dateString in this.calendarReadings) {
      console.log('we have a reading for this day!');
      this.router.navigate(['/admin/update-readings', this.dateString]);
    } else {
      console.log('no readings for this day; creating one....');
      /** TODO:
       *    - modal with form to ask for readingDay.name, if appropriate
       *    - onCancel reloads '/admin/update-readings', but with no dateString
       *    - onSubmit creates the readingDay and then, upon success, loads '/admin/update-readings' with the dateString for the new readingDay
       */
      let readingDay: ReadingDay = {
        id: null,
        date: dateString,
        name: '',// for now, create a new ReadingDay with no 'name' field
        questions: [],
        readings: []
      };
      this.readingDayService.createReadingDay(readingDay)
        .subscribe(
          result => {
            console.log('new readingDay created: ', result);
            // now need to update the calendarReadings....; this is not done
            // automatically, since ngOnInit only gets run when the page is
            // initially loaded; also, can't just launch readingService.announceReadingsRefresh(),
            // since we're actually going to a different day....
            this.readingService.getReadingMetadata()
              .subscribe(
                calendarReadings => {
                  console.log(calendarReadings);
                  this.calendarReadings = calendarReadings;
                  // now can reload the page
                  this.router.navigate(['/admin/update-readings', this.dateString]);
                },
                error => {
                  console.log('error trying to load calendar readings....', error);
                });
          },
          error => {
            console.log('error trying to create new readingDay', error);
          }
        );
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
          /*
          if 404 error, immediately create a new readingDay object
          in the database, wait for the reply, and then set readingsData to the response;
          then it will be ready for posting questions/readings, etc.
           */


        }
      );
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }


}
