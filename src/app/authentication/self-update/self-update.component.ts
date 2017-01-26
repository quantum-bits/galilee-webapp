import {Component, OnInit, Input} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {UserService} from '../user.service';
import {User} from '../../shared/models/user.model';

@Component({
  selector: 'app-self-update',
  templateUrl: './self-update.component.html'
})
export class SelfUpdateComponent implements OnInit {

  private currentUser: User;
  private updateField: string = null;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UserService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
        console.log('query params: ');
        console.log(params);
        if ('field' in params) {
          this.updateField = params['field'];
        }
        if (this.userService.isLoggedIn()) {
          this.currentUser = this.userService.getCurrentUser();
        } else {
          // what to do here?
          console.log('ERROR!!!  user cannot update preferences if not logged in!');
        }
      },
      error => {
        console.log(error);
        //this.modal.openModal();
      }
    );
  }

}
