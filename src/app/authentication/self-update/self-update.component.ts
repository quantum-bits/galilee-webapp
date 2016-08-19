import { Component, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';

import { UserService } from '../user.service';
import {User} from '../../shared/models/user.model';

@Component({
  selector: 'app-self-update',
  templateUrl: 'self-update.component.html',
  styleUrls: ['self-update.component.css'],
  directives: [ROUTER_DIRECTIVES]
})
export class SelfUpdateComponent implements OnInit {

  currentUser: User;

  constructor(private router: Router,
              private userService: UserService) {
    if (this.userService.isLoggedIn()) {
      this.currentUser = this.userService.getCurrentUser();
    } else {
      // what to do here?
      console.log('ERROR!!!  user cannot update preferences if not logged in!');
    }
  }

  ngOnInit() {
  }

}
