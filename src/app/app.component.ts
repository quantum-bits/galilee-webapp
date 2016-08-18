import {Component, OnInit} from '@angular/core';
import {Router, ROUTER_DIRECTIVES} from '@angular/router';

//import {MaterializeDirective} from "angular2-materialize";

import {ReadingService} from './shared/services/reading.service';
import {Reading} from './shared/models/reading.model';
import {PracticeService} from './shared/services/practice.service';
import {Practice} from './shared/models/practice.model';
import {ResourceService} from './shared/services/resource.service';
import {UserService} from './authentication/user.service';

import "angular2-materialize";//don't know if this is required
import "ng2-file-upload";//don't know if this is required

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
    providers: [UserService, ReadingService, PracticeService, ResourceService]
})
export class AppComponent {
  title = 'app works!';

  date:Date;
  readings:Reading[] = [];
  practices:Practice[] = [];
  singleReading:Reading;

  constructor(private readingService:ReadingService,
              private practiceService:PracticeService,
              private user: UserService,
              private router: Router) {
  }

  ngOnInit() {
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
    return this.user.isLoggedIn();
  }

  logout(){
    this.user.logout();
    this.router.navigate(['/login']);
  }


}
