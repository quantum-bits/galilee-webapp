import {Component, OnInit, Input} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {UserService} from '../user.service';
import {User} from '../../shared/models/user.model';

import {UserUpdateFields} from '../../shared/interfaces/user-update-fields.interface';

@Component({
  selector: 'app-self-update',
  templateUrl: './self-update.component.html'
})
export class SelfUpdateComponent implements OnInit {

  currentUser: User;
  private updateField: string = null;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UserService) {
    if (this.userService.isLoggedIn()) {
      this.userService
        .getCurrentUser()
        .subscribe(user => this.currentUser = user);
    } else {
      // what to do here?
      console.log('ERROR!!!  user cannot update preferences if not logged in!');
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
        console.log('query params: ');
        console.log(params);
        if ('field' in params) {
          this.updateField = params['field'];
        }
      },
      error => {
        console.log(error);
        //this.modal.openModal();
      }
    );


  }

}
