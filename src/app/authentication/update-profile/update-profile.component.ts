import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {User} from '../../shared/models/user.model';

import {UserService} from '../user.service';

// TODO: use a service and pull this from the db
const TRANSLATIONS = ["NLT", "NIV", "RSV", "KJV", "NKJV", "ESV"];
const CHOSEN_TRANSLATION = "ESV";

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {

  private translations: string[] = TRANSLATIONS;
  private chosenTranslation: string = CHOSEN_TRANSLATION;
  private currentUser: User = null;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();
    console.log(this.currentUser);
    this.route.url.map(segments => segments.join(''))
      .subscribe(url=>{
        console.log('received url! ',url);
        // Store URL for later (if account information is updated, want to return to the current page)
        this.userService.redirectUrl = url;
      });
  }

}
