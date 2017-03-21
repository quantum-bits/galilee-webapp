import { Component, OnInit, Input } from '@angular/core';
import {Router} from '@angular/router';

import * as moment from 'moment';

@Component({
  selector: 'app-date-nav',
  templateUrl: './date-nav.component.html',
  styleUrls: ['./date-nav.component.css']
})
export class DateNavComponent implements OnInit {

  @Input() dateString: string = null;

  private days: any;

  //private RCLDate: Moment;

  constructor(private router: Router) { }

  ngOnInit() {
    console.log('XXX datestring: ', this.dateString);
    this.days = this.initializeDateNav(this.dateString);
    //this.RCLDate = moment(this.dateString);
    //console.log(this.RCLDate);
  }

  initializeDateNav(dateString: string) {
    // some help from the mini-calendar component by Blaine Backman
    let RCLDate = moment(dateString).clone();

    let date = RCLDate.clone();
    date.isoWeekday(0);

    //let middleDate = moment(dateString).clone();
    //console.log('middle date is: ', middleDate);
    let days = [];
    //let date = middleDate.add(-3, 'd');
    for (let i = 0; i < 7; i++) {
      days.push({
        name: date.format('ddd DD'),
        isRCLToday: date.isSame(RCLDate, 'day'),
        date: date
      });
      date = date.clone();
      date.add(1, 'd');
    }
    console.log('days: ', days);
    return days;
  }

  shiftDays(dayShift: number) {
    //
  }

  shiftRCLDate(dayArrayIndex: number) { // change the RCLDate, but leave the Date Nav as is (i.e., unshifted)
    let newRCLDateMoment = this.days[dayArrayIndex].date.clone();

    let newDateString = newRCLDateMoment.format('YYYY-MM-DD');

    this.router.navigate(['/end-user/readings', newDateString]);

    /*
    this.RCLDate = newRCLDateMoment.toDate();
    this.readingService.setRCLDate(this.RCLDate);//update the RCLDate in the service
    for (let day of this.days) {
      day.isRCLToday = day.date.isSame(this.RCLDate, 'day');
    }
    console.log(this.days);
    this.fetchReadings(); // get the readings for the new RCLDate
    */
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
