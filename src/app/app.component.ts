import {Component, OnInit} from '@angular/core';
import {Router, ROUTER_DIRECTIVES} from '@angular/router';

import {MaterializeDirective} from "angular2-materialize";

import {ReadingService} from './shared/services/reading.service';
import {Reading} from './shared/models/reading.model';
import {PracticeService} from './shared/services/practice.service';
import {Practice} from './shared/models/practice.model';
import {ResourceService} from './shared/services/resource.service';
import {UserService} from './authentication/user.service';

//import { ReadingService } from './shared';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  providers: [ReadingService, PracticeService, ResourceService],
  directives: [ROUTER_DIRECTIVES, MaterializeDirective],
})
export class AppComponent implements OnInit {
  title = 'app works!';

  date:Date;
  readings:Reading[] = [];
  practices:Practice[] = [];
  singleReading:Reading;

  public landingPage = true;
  public detailsPage = false;
  public managePage = false;

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

  isLoggedIn(){
    return this.user.isLoggedIn();
  }

  logout(){
    this.user.logout();
    this.router.navigate(['/login']);
  }

}
