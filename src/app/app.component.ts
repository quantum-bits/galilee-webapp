import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {ReadingService} from './shared/services/reading.service';
import {Reading} from './shared/models/reading.model';
import {PracticeService} from './shared/services/practice.service';
import {Practice} from './shared/models/practice.model';
import {ResourceService} from './shared/services/resource.service';
import {UserService} from './authentication/user.service';
import {User} from './shared/models/user.model';

import "ng2-file-upload";//don't know if this is required

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
    providers: [
      //UserService,
      ReadingService, PracticeService, ResourceService]
})
export class AppComponent {
  title = 'app works!';

  date:Date;
  readings:Reading[] = [];
  practices:Practice[] = [];
  singleReading:Reading;
  currentUser: User;

  constructor(private readingService:ReadingService,
              private practiceService:PracticeService,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
    // grab current user info if it exists....
    if (this.userService.isLoggedIn()){
      this.currentUser = this.userService.getCurrentUser();
      console.log('inside ngOnInit, and the user is logged in already');
      console.log(this.currentUser);
    } else {
      console.log('inside ngOnInit, and the user is not logged in yet');
      console.log(this.currentUser);
    }
    // ...and sign up for the service in order to keep up with changes
    this.userService.userAnnounced$.subscribe(
      user => {
        this.currentUser = user;
        console.log('inside app comp...user updated');
        console.log(this.currentUser);
      });
    /*
    if(this.isLoggedIn()) {
      //this.currentUserName = this.user.currentUser.fullName();
      console.log()
    }
    */

    this.date = new Date();
    // FIXME hardcoded readings
    this.readingService.getTodaysReadings().then(
      (readings) => {
        this.readings = readings;
      }
    );
    this.readingService.getSingleReading().then(
      (reading) => {
        this.singleReading = reading;
      }
    );

    this.practiceService.getPractices().subscribe(
      practices => this.practices = practices
    );

  }



    // FIXME: This is only here to work around a compile-time error.
    // Presumably it should hit a method on the user service.
    //isLoggedIn() {
    //    return true;
    //}




  isLoggedIn(){
    return this.userService.isLoggedIn();
  }

  logout(){
    this.userService.logout();
    this.router.navigate(['/login']);
  }


}
