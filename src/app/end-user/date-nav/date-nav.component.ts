import { Component, OnInit, OnChanges, Input } from '@angular/core';
import {Router} from '@angular/router';

import * as moment from 'moment';

import {ReadingService} from '../../shared/services/reading.service';

import {CalendarEntries} from '../../shared/interfaces/calendar-entries.interface';

declare var $: any; // for using jQuery within this angular component

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
  private currentDateIndex: number = 0; // used to programmatically "click" the correct tab

  constructor(private router: Router,
              private readingService: ReadingService) { }

  ngOnInit() {
  }

  ngOnChanges(){
    console.log('XXXXXX inside ngonchanges; calendarReadings: ',this.calendarReadings);
    console.log('XXXXXX inside ngonchanges; dateString: ',this.dateString);
    if (this.calendarReadings === null) {
      this.readingService.getReadingMetadata()
        .subscribe(
          calendarReadings => {
            console.log(calendarReadings);
            this.calendarReadings = calendarReadings;
            this.setRCLDate(this.dateString);
            this.days = this.initializeDateNav();
          },
          error => {
            console.log('error: ', error);
          }
        );
    } else {
      this.setRCLDate(this.dateString);
      //let newDate = this.RCLDate.clone();
      //newDate.startOf('week');
      //let weekUnchanged = newDate.isSame(this.days[0].date, 'day');
      //console.log('week is unchanged: ', weekUnchanged);
      //if (!weekUnchanged) {
      this.days = this.initializeDateNav();
      //}
      // now programmatically select the appropriate tab
      console.log('date index: ', this.currentDateIndex);
      let tabId = 'date-nav-tab'+this.currentDateIndex;
      console.log('tab ID: ', tabId);
      $('ul.tabs').tabs('select_tab', 'date-nav-tab'+this.currentDateIndex);

      //[attr.href]="'#tab'+i"

      //console.log('first day of this week: ', this.days[0].date);
      //console.log('first day of the week in memory: ', this.days[0].date);

      // ...arg....should only refresh this if we have actually moved
      // to a new week, otherwise the tab slider doesn't slide over!
      // ...also, should keep RCLDate updated!!!!
      //.....
      // this.days = this.initializeDateNav(this.dateString);
    }
  }

  setRCLDate(dateString: string) {
    if (dateString === 'today') {
      this.RCLDate = moment();
    } else {
      this.RCLDate = moment(dateString);
    }
  }

  initializeDateNav() {
    // some help from the mini-calendar component by Blaine Backman
    let date = this.RCLDate.clone();
    date.startOf('week');
    let days = [];
    let localDateString: string = "";
    let containsReadings: boolean;
    //let date = middleDate.add(-3, 'd');
    for (let i = 0; i < 7; i++) {
      localDateString = date.format('YYYY-MM-DD');
      containsReadings = false;
      if (localDateString in this.calendarReadings) {
        containsReadings = (this.calendarReadings[localDateString] > 0);
      }
      if (date.isSame(this.RCLDate, 'day')) {
        this.currentDateIndex = i;
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


  /**
   * id="captionInModal{{i}}"
   type="text"
   [class.warning-background]="!(resourceCollectionForm.controls.resources.controls[i].controls.caption.valid||!resourceCollectionForm.controls.resources.controls[i].controls.caption.touched)"
   [class.valid-background]="(resourceCollectionForm.controls.resources.controls[i].controls.caption.valid||!resourceCollectionForm.controls.resources.controls[i].controls.caption.touched)"
   formControlName="caption">
   <label
   *[attr.for]="'captionInModal'+i"
   */


  onClick() {
    // Note: must include the following declaration (above) in component:
    //          declare var $: any;
    console.log('tabbing....');
    //console.log('#tab0' + modalID);
    //$('ul.tabs').tabs('select_tab', 'date-nav-tab4');
    $('ul.tabs').tabs('this.selectt_tab', 'date-nav-tab4');

    /**
     * maybe could use an id instead and use the Renderer to render a 'click' on the anchor tag
     * select_tab : function( id ) {
     *    this.find('a[href="#' + id + '"]').trigger('click');
     * }
     */
    //$('#' + modalID).closeModal();
    //[attr.href]="'#tab'+(i+1)"
  }


}
