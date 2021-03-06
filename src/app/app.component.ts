import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {ReadingService} from './shared/services/reading.service';
import {PracticeService} from './shared/services/practice.service';
import {ResourceService} from './shared/services/resource.service';
import {GroupService} from './shared/services/group.service';
import {UserService} from './authentication/user.service';
import {User} from './shared/models/user.model';
import {ADMIN} from './shared/models/permission.model';
import {JournalService} from './shared/services/journal.service';
import {PostService} from './shared/services/post.service';
import {ReadingDayService} from './shared/services/reading-day.service';
import {DirectionService} from './shared/services/direction.service';
import {DateNavSpyService} from './shared/services/date-nav-spy.service';
import {ResourceModalCommunicationService} from './end-user/resource-list/resource-modal-communication.service';
import { FacebookService, InitParams } from 'ngx-facebook';
import { UIParams, UIResponse } from 'ngx-facebook';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  //styleUrls: ['../materialize-src/sass/ghpages-materialize.scss','./app.component.css'],
  providers: [
    JournalService,
    PostService,
    PracticeService,
    ReadingDayService,
    ReadingService,
    ResourceService,
    DirectionService,
    DateNavSpyService,
    UserService,
    GroupService,
    ResourceModalCommunicationService,
    FacebookService
  ]
})
export class AppComponent implements OnInit {
  title = 'app works!';

  currentUser: User = null;
  currentUserIsAdmin: boolean = false;

  // date: Date;
  // readings: Reading[] = [];
  // practices: Practice[] = [];
  // singleReading: Reading;
  // currentUser: User;

  private showPracticesDropdown: boolean = false;
  showResourcesDropdown: boolean = false;
  showAdminDropdown: boolean = false;
  showHelpDropdown: boolean = false;

  constructor(private readingService: ReadingService,
              private practiceService: PracticeService,
              private journalService: JournalService,
              private userService: UserService,
              private router: Router,
              private postService: PostService,
              private groupService: GroupService,
              private fb: FacebookService) {
    /*
    let initParams: InitParams = {
      appId: '1927971220769787',
      xfbml: true,
      version: 'v2.10'
    };
    fb.init(initParams);
    */

  }

  ngOnInit() {
    this.userService.watchCurrentUser()
      .subscribe(user => {
        this.currentUser = user;
        this.currentUserIsAdmin = this.userService.can(ADMIN);
      });

    // grab current user info if it exists....
    // if (this.userService.isLoggedIn()) {
    //   this.currentUser = this.userService.getCurrentUser();
    //   console.log('inside ngOnInit, and the user is logged in already');
    //   console.log(this.currentUser);
    // } else {
    //   console.log('inside ngOnInit, and the user is not logged in yet');
    //   console.log(this.currentUser);
    // }
    // // ...and sign up for the service in order to keep up with changes
    // this.userService.userAnnounced$.subscribe(
    //   user => {
    //     this.currentUser = user;
    //     console.log('inside app comp...user updated');
    //     console.log(this.currentUser);
    //   });
    //
    // this.date = new Date();
    // // FIXME hardcoded readings
    // this.readingService
    //   .getTodaysReadings()
    //   .subscribe(readings => {
    //       this.readings = readings
    //     }
    //   );
    // this.readingService.getSingleReading().then(
    //   (reading) => {
    //     this.singleReading = reading;
    //   }
    // );
    //
    // this.practiceService.getPractices().subscribe(
    //   practices => this.practices = practices
    // );
  }

  isLoggedIn() {
    return this.userService.isLoggedIn();
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/end-user/readings/today']);
  }

  goToJournal() {
    this.router.navigate(['/end-user/journal']);
  }

  goToForum() {
    this.router.navigate(['/end-user/post']);
  }

  goHome() {
    this.router.navigate(['/end-user']);
  }

  togglePracticesDropdown(event) {
    event.stopPropagation();
    this.showPracticesDropdown = !this.showPracticesDropdown;
  }

  toggleResourcesDropdown(event) {
    event.stopPropagation();
    this.showResourcesDropdown = !this.showResourcesDropdown;
  }

  toggleHelpDropdown(event) {
    event.stopPropagation();
    this.showHelpDropdown = !this.showHelpDropdown;
  }

  toggleAdminDropdown(event) {
    event.stopPropagation();
    this.showAdminDropdown = !this.showAdminDropdown;
  }

  inAnyGroups() {
    return this.userService.inGroups();
  }

  /*
  share() {

    const options: UIParams = {
      method: 'share',
      href: 'https://github.com/zyramedia/ng2-facebook-sdk'
    };

    this.fb.ui(options)
      .then((res: UIResponse) => {
        console.log('Got the users profile', res);
      });

  }
  */



}
