import { Component, OnInit, OnChanges, OnDestroy, Input } from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import * as moment from 'moment';

import {ReadingService} from '../../shared/services/reading.service';
import {DateNavSpyService} from '../../shared/services/date-nav-spy.service';

import {CalendarEntries} from '../../shared/interfaces/calendar-entries.interface';

declare var $: any; // for using jQuery within this angular component

//moment().startOf('week').subtract(2, 'weeks')

@Component({
  selector: 'app-date-nav',
  templateUrl: './date-nav.component.html',
  styleUrls: ['./date-nav.component.css']
})
export class DateNavComponent implements OnInit, OnChanges, OnDestroy {

  @Input() dateString: string = null;

  private days: any;
  private calendarReadings: CalendarEntries = null;
  private RCLDate: any = null; // a moment object that keeps track of which date the user is looking at
  private currentDateIndex: number = 0; // used to programmatically "click" the correct tab

  private canShiftRight: boolean = false;
  private canShiftLeft: boolean = false;
  private tabCounter: number = 0;

  private subscription: Subscription;

  private readings: any;

  constructor(private router: Router,
              private readingService: ReadingService,
              private dateNavSpyService: DateNavSpyService) {
    this.subscription = dateNavSpyService.dateNavUpdated$
      .subscribe(message => {
        console.log('SPY....received message: ', message);
        this.updateTabSlider();
      });
  }

  ngOnInit() { }

  ngOnChanges(){
    this.setRCLDate(this.dateString);
    if (this.calendarReadings === null) {
      this.readingService.getReadingMetadata()
        .subscribe(
          calendarReadings => {
            console.log(calendarReadings);
            this.calendarReadings = calendarReadings;

            this.initializeDateNav();
          },
          error => {
            console.log('error: ', error);
          }
        );
    } else {
      this.initializeDateNav();
      // now programmatically select the appropriate tab (using jQuery); see:
      // http://materializecss.com/tabs.html,
      // https://github.com/InfomediaLtd/angular2-materialize/blob/master/app/components/tabs-routing.ts

      //console.log('XXXXXXXXXXX moving tab to: ', this.currentDateIndex);
      //let tabId = 'date-nav-tab'+this.currentDateIndex;
      //$('ul.tabs').tabs('select_tab', 'date-nav-tab'+this.currentDateIndex);
    }
  }

  updateTabSlider() {
    this.tabCounter++;
    console.log('tabCounter: ', this.tabCounter);
    if (this.tabCounter === 7) {
      console.log('XXXXXXXXXXX moving tab to: ', this.currentDateIndex);
      let tabId = 'date-nav-tab' + this.currentDateIndex;
      $('ul.tabs').tabs('select_tab', 'date-nav-tab' + this.currentDateIndex);
    }
  }
  setRCLDate(dateString: string) {
    if (dateString === 'today') {
      this.RCLDate = moment();
    } else {
      this.RCLDate = moment(dateString);
    }
  }

  setShiftPermissions() {
    // assumes this.calendarReadings and this.RCLDate have been set
    // checks to see if there are any readings in the week to the
    // left and to the right, and sets permissions accordingly
    this.canShiftRight = false;
    this.canShiftLeft = false;
    let date = this.RCLDate.clone().startOf('week').add(1, 'week');
    for (let i = 0; i < 7; i++) {
      if (this.dateContainsReadings(date.format('YYYY-MM-DD'))) {
        this.canShiftRight = true;
      }
      console.log(date.format('YYYY-MM-DD'));
      date.add(1, 'd');
    }
    date = this.RCLDate.clone().startOf('week').subtract(1, 'week');
    for (let i = 0; i < 7; i++) {
      if (this.dateContainsReadings(date.format('YYYY-MM-DD'))) {
        this.canShiftLeft = true;
      }
      console.log(date.format('YYYY-MM-DD'));
      date.add(1, 'd');
    }
  }

  dateContainsReadings(dateString: string){
    let containsReadings = false;
    if (dateString in this.calendarReadings) {
      containsReadings = (this.calendarReadings[dateString] > 0);
    }
    return containsReadings;
  }

  initializeDateNav() {
    // some help from the mini-calendar component by Blaine Backman;
    // this method sets up the days array for the date-nav, and also
    // sets the index for the current RCL date on the date-nav (this.currentDateIndex)
    this.tabCounter = 0;
    let date = this.RCLDate.clone().startOf('week');;
    let days = [];
    for (let i = 0; i < 7; i++) {
      if (date.isSame(this.RCLDate, 'day')) {
        this.currentDateIndex = i;
      }
      days.push({
        name: date.format('ddd DD'),
        isRCLToday: date.isSame(this.RCLDate, 'day'),
        date: date,
        disabled: !this.dateContainsReadings(date.format('YYYY-MM-DD'))
      });
      date = date.clone().add(1,'d');
    }
    console.log('days: ', days);
    this.days = days;
    this.setShiftPermissions();

    this.createReadingsArrayforDatePicker();
  }

  disabledMessage(disabled: boolean){
    if (disabled) {
      return '...sorry, no readings for today';
    } else {
      return '';
    }
  }

  shiftWeek(unitDirection: number) {//unitDirection must be +/- 1
    let date = this.RCLDate.clone().startOf('week').add(unitDirection, 'week');
    if (unitDirection === -1) {
      date.endOf('week');
    }
    let index = 0;
    let nonEmptyReadingDayFound = false;
    while (Math.abs(index) < 7 && !nonEmptyReadingDayFound) {
      console.log(index);
      if (this.dateContainsReadings(date.format('YYYY-MM-DD'))){
        nonEmptyReadingDayFound = true;
        console.log('found reading!', this.RCLDate, this.calendarReadings);
      } else {
        date.add(unitDirection, 'd');
      }
      index = index+unitDirection;
    }
    if (nonEmptyReadingDayFound) {
      let newDateString = date.format('YYYY-MM-DD');
      this.router.navigate(['/end-user/readings', newDateString]);
    }
    // the right and left arrows in the date-nav should only appear
    // if there is in fact a non-empty reading day to the right or left,
    // respectively, so supposedly there will always be a non-empty reading day....
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

  onClick(){
    console.log(this.currentDateIndex);
    console.log(this.RCLDate);

    let tabId = 'date-nav-tab'+this.currentDateIndex;
    $('ul.tabs').tabs('select_tab', 'date-nav-tab'+this.currentDateIndex);


  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  materializeDatePickerParams() {
    return [{ selectYears: true, selectMonths: true, disable: this.readings, onSet: this.setDate }];
  }

  createReadingsArrayforDatePicker() {
    if (this.readings == null || this.readings == undefined) {
      this.readings = [];
    
      this.readings.push(true);
      
      for (var key in this.calendarReadings) {
        var pieces = key.split("-");
        var date = [parseInt(pieces[0]), parseInt(pieces[1]), parseInt(pieces[2])];
        this.readings.push(date);
      }
    }
  }

  setDate(context) {
    console.log(context);
  }

}
