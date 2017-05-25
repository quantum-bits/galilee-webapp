import { Component, OnInit } from '@angular/core';

import {UserService} from '../../authentication/user.service';

@Component({
  selector: 'app-help-create-account',
  templateUrl: './help-create-account.component.html',
  styleUrls: ['./help-create-account.component.css']
})
export class HelpCreateAccountComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  isLoggedIn() {
    return this.userService.isLoggedIn();
  }

}
