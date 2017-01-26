import { Component, OnInit, ViewChild } from '@angular/core';
import {Router} from '@angular/router';

import * as moment from 'moment';

import {ReadingsData} from '../../shared/interfaces/readings-data.interface';
import {GroupPostData} from '../../shared/models/group-post-data.model';
//import {Post} from '../../shared/models/post.model';

import {ReadingService} from '../../shared/services/reading.service';
import {PostService} from '../../shared/services/post.service';
import {SimpleModalComponent} from "../readings/simple-modal.component";

const MAX_NUMBER_POSTS = 5;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild('dashboardSorry') modal: SimpleModalComponent;

  private RCLDate: Date;
  private days: any;
  private readingsData: ReadingsData;
  private multiGroupPostData: GroupPostData[];

  private maxNumberPosts = MAX_NUMBER_POSTS;

  constructor(
    private readingService: ReadingService,
    private postService: PostService,
    private router: Router) { }

  ngOnInit() {
    console.log('RCL date set? ', this.readingService.RCLDateIsSet());
    if (!this.readingService.RCLDateIsSet()) {
      let today = new Date();
      console.log('today is: ', today);
      this.readingService.setRCLDate(today);
    }
    this.RCLDate = this.readingService.fetchRCLDate();
    console.log('RCL Date:', this.RCLDate);
    this.days = this.initializeDateNav();
    this.fetchReadings();
    this.fetchGroupPosts();
  }

  fetchReadings(){
    let dateString = this.convertToDateString(this.RCLDate);
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

  fetchGroupPosts(){
    this.postService.getPostsAllGroups(this.maxNumberPosts)
      .subscribe(
        multiGroupPostData => {
          this.multiGroupPostData = [];
          for (let groupPostData of multiGroupPostData) {
            this.multiGroupPostData.push(new GroupPostData(groupPostData));//need to use the constructor, etc., if want access to the methods
          }
          console.log('group posts!', this.multiGroupPostData);
        },
        error => {
          this.multiGroupPostData = undefined;
          //this.modal.openModal('', 'No readings for '+dateString);
        }
      );
  }


  initializeDateNav(){
    // some help from the mini-calendar component by Blaine Backman
    let middleDate = moment(this.RCLDate).clone();
    console.log('middle date is: ', middleDate);
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
    console.log('days: ', days);
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
    // Note: using date.toISOString().substring(0, 10) ignores
    //       time zones...!  So in the evening, in EST, for example,
    //       the date string will be for the following day
    let dateMoment = moment(date).clone();
    let dateString = dateMoment.format('YYYY-MM-DD');
    return dateString;
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
