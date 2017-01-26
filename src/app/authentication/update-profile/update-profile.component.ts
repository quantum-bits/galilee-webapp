import { Component, OnInit } from '@angular/core';
import {Router, NavigationExtras} from '@angular/router';

import {User} from '../../shared/models/user.model';
//import {UserPermission} from '../../shared/models/user-permission.model';

import {UserService} from '../user.service';

const TRANSLATIONS = ["NLT", "NIV", "RSV", "KJV", "NKJV", "ESV"];

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {

  private translations: string[] = TRANSLATIONS;
  private chosenTranslation: string = "ESV";
  private currentUser: User = null;

  constructor(
    private userService: UserService,
    private router: Router) { }

  ngOnInit() {
    this.userService
      .getCurrentUser()
      .subscribe(user => {
        this.currentUser = user;
        console.log("CURRENT USER", this.currentUser);
      });
  }

  updateName(){
    let navigationExtras: NavigationExtras = {
      queryParams: {'field': 'name'}
    };
    this.router.navigate(['/self-update'],navigationExtras);
  }

  updateEmail(){
    let navigationExtras: NavigationExtras = {
      queryParams: {'field': 'email'}
    };
    this.router.navigate(['/self-update'],navigationExtras);
  }

  updatePassword(){
    let navigationExtras: NavigationExtras = {
      queryParams: {'field': 'password'}
    };
    this.router.navigate(['/self-update'],navigationExtras);
  }


}
