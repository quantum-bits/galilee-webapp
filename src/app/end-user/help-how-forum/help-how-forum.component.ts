import { Component, OnInit } from '@angular/core';

import {UserService} from '../../authentication/user.service';

@Component({
  selector: 'app-help-how-forum',
  templateUrl: './help-how-forum.component.html',
  styleUrls: ['./help-how-forum.component.css']
})
export class HelpHowForumComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  isLoggedIn() {
    return this.userService.isLoggedIn();
  }

  getCurrentUser(){
    return this.userService.getCurrentUser();
  }

  inAnyGroups() {
    return this.userService.inGroups();
  }

}
