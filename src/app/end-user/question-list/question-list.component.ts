import {Component, OnInit, OnChanges, Input } from '@angular/core';

import {UserService} from '../../authentication/user.service';

import * as moment from 'moment';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent implements OnInit, OnChanges {

  @Input() questions: string[];

  private currentUserLoggedIn: boolean = false;

  constructor(private userService: UserService){
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.currentUserLoggedIn = this.userService.isLoggedIn();

    /*
    if (this.dateString==='today'){
      // this is so moment can interpret the date properly in the template
      this.dateString = moment(new Date()).format('YYYY-MM-DD');
    }
    */

  }
}
