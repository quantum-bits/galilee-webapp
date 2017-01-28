import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import {UserService} from '../user.service';

const DEFAULT_REDIRECT_URL = '/end-user/dashboard';

@Component({
  selector: 'app-self-update-success',
  templateUrl: './self-update-success.component.html',
  styleUrls: ['./self-update-success.component.css']
})
export class SelfUpdateSuccessComponent implements OnInit {

  constructor(
    private router: Router,
    private userService: UserService) { }

  ngOnInit() {
  }


  onContinue(){
    let redirect = this.userService.redirectUrl || DEFAULT_REDIRECT_URL;
    this.router.navigate([redirect]);
  }

}
