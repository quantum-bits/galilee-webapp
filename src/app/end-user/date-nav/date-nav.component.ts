import { Component, OnInit, OnChanges, Input } from '@angular/core';
import {Router} from '@angular/router';

import * as moment from 'moment';

import {ReadingService} from '../../shared/services/reading.service';

import {CalendarEntries} from '../../shared/interfaces/calendar-entries.interface';


//moment().startOf('week').subtract(2, 'weeks')

@Component({
  selector: 'app-date-nav',
  templateUrl: './date-nav.component.html',
  styleUrls: ['./date-nav.component.css']
})
export class DateNavComponent implements OnInit, OnChanges {

  @Input() dateString: string = null;

  private days: any;
  private calendarReadings: CalendarEntries = null;
  private RCLDate: any = null; // a moment object that keeps track of which date the user is looking at

  constructor(private router: Router,
              private readingService: ReadingService) { }

  ngOnInit() {
    console.log('XXXXXX inside ngoninit; calendarReadings: ',this.calendarReadings);
    this.readingService.getReadingMetadata()
      .subscribe(
        calendarReadings => {
          console.log(calendarReadings);
          this.calendarReadings = calendarReadings;
          this.days = this.initializeDateNav(this.dateString);
        },
        error => {
          console.log('error: ', error);
        }
      );
  }

  ngOnChanges(){
    //
  }

  initializeDateNav(dateString: string) {
    // some help from the mini-calendar component by Blaine Backman
    if (dateString === 'today') {
      this.RCLDate = moment();
    } else {
      this.RCLDate = moment(dateString);
    }

    let date = this.RCLDate.clone();
    date.isoWeekday(0);

    //let middleDate = moment(dateString).clone();
    //console.log('middle date is: ', middleDate);
    let days = [];
    let localDateString: string = "";
    let containsReadings: boolean;
    //let date = middleDate.add(-3, 'd');
    for (let i = 0; i < 7; i++) {
      localDateString = date.format('YYYY-MM-DD');
      console.log('date: ',localDateString);
      containsReadings = false;
      if (localDateString in this.calendarReadings) {
        containsReadings = (this.calendarReadings[localDateString] > 0);
      }
      days.push({
        name: date.format('ddd DD'),
        isRCLToday: date.isSame(this.RCLDate, 'day'),
        date: date,
        disabled: !containsReadings
      });
      date = date.clone();
      date.add(1, 'd');
    }
    console.log('days: ', days);
    return days;
  }

  disabledMessage(disabled: boolean){
    if (disabled) {
      return '...sorry, no readings for today';
    } else {
      return '';
    }
  }

  shiftDays(dayShift: number) {
    //
  }

  shiftRCLDate(dayArrayIndex: number) { // change the RCLDate, but leave the Date Nav as is (i.e., unshifted)
    if (!this.days[dayArrayIndex].disabled) {
      let newRCLDateMoment = this.days[dayArrayIndex].date.clone();
      //let newDateString = '2017-03-31';
      let newDateString = newRCLDateMoment.format('YYYY-MM-DD');
      this.router.navigate(['/end-user/readings', newDateString]);
    }
  }


  /*
  shiftDays(dayShift: number) {//shifts the date range on the navbar by dayShift days
    let newRCLDateMoment = moment(this.RCLDate).clone().add(dayShift, 'd')
    //newRCLDateMoment.date.add(dayShift,'d');
    this.RCLDate = newRCLDateMoment.toDate();
    this.readingService.setRCLDate(this.RCLDate);//update the RCLDate in the service
    console.log(this.RCLDate);
    for (let day of this.days) {
      day.date.add(dayShift, 'd');
      day.name = day.date.format('MMM DD');
      day.isRCLToday = day.date.isSame(this.RCLDate, 'day');
    }
    console.log(this.days);
    this.fetchReadings(); // get the readings for the new RCLDate
  }
*/





}
