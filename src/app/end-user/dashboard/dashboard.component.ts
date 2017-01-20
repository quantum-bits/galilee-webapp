import { Component, OnInit, ViewChild, ElementRef, Renderer } from '@angular/core';

import * as moment from 'moment';

import {ReadingService} from '../../shared/services/reading.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild('datePicker') datePicker: ElementRef;

  //@ViewChild('myModalResourcePicker') input: ElementRef;

  private RCLDate: Date;
  private days: any;

  constructor(private readingService: ReadingService,
              private renderer: Renderer) { }

  ngOnInit() {
    console.log('RCL date set? ', this.readingService.RCLDateIsSet());
    if (!this.readingService.RCLDateIsSet()) {
      let today = new Date();
      this.readingService.setRCLDate(today);
    }
    this.RCLDate = this.readingService.fetchRCLDate();
    console.log('RCL Date:', this.RCLDate);
    this.days = this.initializeDateNav();

  }

  initializeDateNav(){
    // some help from the mini-calendar component by Blaine Backman
    let middleDate = moment(this.RCLDate).clone();
    let days = [];
    let date = middleDate.add(-3,'d');
    for (let i = 0; i < 7; i++) {
      days.push({
        name: date.format('MMM DD'),
        isRCLToday: date.isSame(this.RCLDate, 'day'),
        date: date
      });
      date = date.clone();
      date.add(1, 'd');
    }
    return days;
  }

  shiftDays(dayShift: number) {
    let newRCLDateMoment = moment(this.RCLDate).clone().add(dayShift,'d')
    //newRCLDateMoment.date.add(dayShift,'d');
    this.RCLDate = newRCLDateMoment.toDate();
    this.readingService.setRCLDate(this.RCLDate);//update the RCLDate in the service
    console.log(this.RCLDate);
    for (let day of this.days) {
      day.date.add(dayShift,'d');
      day.name = day.date.format('MMM DD');
      day.isRCLToday = day.date.isSame(this.RCLDate, 'day');
    }
    console.log(this.days);
  }

  shiftRCLDate(dayArrayIndex: number) { // change the RCLDate, but leave the Date Nav as is (i.e., unshifted)
    let newRCLDateMoment = this.days[dayArrayIndex].date.clone();
    this.RCLDate = newRCLDateMoment.toDate();
    this.readingService.setRCLDate(this.RCLDate);//update the RCLDate in the service
    for (let day of this.days) {
      day.isRCLToday = day.date.isSame(this.RCLDate, 'day');
    }
    console.log(this.days);
  }

  fetchRCLDate(){
    console.log(this.readingService.fetchRCLDate());
  }

}
