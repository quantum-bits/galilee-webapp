import {Component, OnInit, OnChanges, Input, Output, EventEmitter} from '@angular/core';

import {UserService} from '../../authentication/user.service';

import * as moment from 'moment';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent implements OnInit, OnChanges {

  @Input() questions: string[];
  @Input() dateString: string;
  @Output() openJournal = new EventEmitter();

  private currentUserLoggedIn: boolean = false;

  constructor(private userService: UserService){
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.currentUserLoggedIn = this.userService.isLoggedIn();
    console.log('change!', this.dateString);
    if (this.dateString==='today'){
      // this is so moment can interpret the date properly in the template
      this.dateString = moment(new Date()).format('YYYY-MM-DD');
    }


  }

  goToJournal() {
    this.openJournal.emit()
  }
}
