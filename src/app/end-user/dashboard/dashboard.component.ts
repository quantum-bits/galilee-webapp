import { Component, OnInit, ViewChild } from '@angular/core';
import {Router} from '@angular/router';

import * as moment from 'moment';

import {ReadingService} from '../../shared/services/reading.service';
import {SimpleModalComponent} from "../readings/simple-modal.component";

// TODO: bundle questions in with readingsData
const QUESTIONS = [
  "What did today's readings make you think about?",
  "How can you apply what you have learned in the coming days?",
  "Are there things that you need to discuss with your friends?"
]

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private RCLDate: Date;
  private days: any;
  private readingsData: any;
  private questions: string[] = QUESTIONS;

  @ViewChild('sorry') modal: SimpleModalComponent;

  constructor(
    private readingService: ReadingService,
    private router: Router) { }

  ngOnInit() {
    console.log('RCL date set? ', this.readingService.RCLDateIsSet());
    if (!this.readingService.RCLDateIsSet()) {
      let today = new Date();
      this.readingService.setRCLDate(today);
    }
    this.RCLDate = this.readingService.fetchRCLDate();
    console.log('RCL Date:', this.RCLDate);
    this.days = this.initializeDateNav();
    this.fetchReadings();
  }

  fetchReadings(){
    let dateString = this.convertToDateString(this.RCLDate)
    this.readingService.fetchSavedReadings(dateString)
      .subscribe(
        readingsData => {
          this.readingsData = readingsData;
        },
        error => {
          this.readingsData = undefined;
          this.modal.openModal('', 'No readings for '+dateString);
        }
      );
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

  shiftDays(dayShift: number) {//shifts the date range on the navbar by dayShift days
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
    this.fetchReadings(); // get the readings for the new RCLDate
  }

  shiftRCLDate(dayArrayIndex: number) { // change the RCLDate, but leave the Date Nav as is (i.e., unshifted)
    let newRCLDateMoment = this.days[dayArrayIndex].date.clone();
    this.RCLDate = newRCLDateMoment.toDate();
    this.readingService.setRCLDate(this.RCLDate);//update the RCLDate in the service
    for (let day of this.days) {
      day.isRCLToday = day.date.isSame(this.RCLDate, 'day');
    }
    console.log(this.days);
    this.fetchReadings(); // get the readings for the new RCLDate
  }

  fetchRCLDate(){
    console.log(this.readingService.fetchRCLDate());
  }

  convertToDateString(date: Date) {
    return date.toISOString().substring(0, 10);
  }

  openJournal(){
    console.log('open the journal!');
    this.router.navigate(['/end-user/journal-entry']);
  }

  openReadings(){
    console.log('open the readings!');
    let dateString = this.convertToDateString(this.RCLDate);
    this.router.navigate(['/end-user/readings', dateString]);
  }

}
