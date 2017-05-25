import { Component, OnInit, OnChanges } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {User} from '../../shared/models/user.model';

import {ReadingService} from '../../shared/services/reading.service';
import {UserService} from '../user.service';
import {Version} from '../../shared/interfaces/version.interface';


@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit, OnChanges {

  private availableVersions: Version[];
  private chosenVersion: string = "MSG";
  private currentUser: User = null;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private readingService: ReadingService) { }

  ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();
    console.log(this.currentUser);

    if(this.currentUser.preferredVersionId != null) {
      this.readingService.getVersionById(this.currentUser.preferredVersionId)
        .subscribe(
          version => {
            console.log('version: ', version.code);
            this.chosenVersion = version.code;
          },
          error => {
            console.log('error retrieving default version');
          }
        );
    }


    this.route.url.map(segments => segments.join(''))
      .subscribe(url=>{
        console.log('received url! ',url);
        // Store URL for later (if account information is updated, want to return to the current page)
        this.userService.redirectUrl = url;
      });
    this.readingService.getVersions()
      .subscribe(
        versions => {
          console.log('versions: ', versions);
          this.availableVersions = versions;
        },
        error => {
          console.log('error retrieving versions');
        }
      );
  }

  ngOnChanges(){

  }

  updateDefaultVersion(version:Version){
    this.userService.updatePreferredVersion(this.currentUser.id, version.id)
      .subscribe(
        (result) => {
          if (result.ok) {
            console.log('user updated OK!');
            this.currentUser.preferredVersionId = version.id;
            this.chosenVersion = version.code;
            this.userService.setCurrentUser(this.currentUser);
            //set current version, and dump stored readings to force a refresh....
            this.readingService.dumpStoredReadings();
            this.readingService.setCurrentVersion(version);
          }
        },
        (error) => {
          console.log('there was an error');
          console.log(error);
        }
      );
  }

}
