import { Component, OnInit } from '@angular/core';

import {UserService} from '../../authentication/user.service';

@Component({
  selector: 'app-help-how-journal',
  templateUrl: './help-how-journal.component.html',
  styleUrls: ['./help-how-journal.component.css']
})
export class HelpHowJournalComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  isLoggedIn() {
    return this.userService.isLoggedIn();
  }

}
