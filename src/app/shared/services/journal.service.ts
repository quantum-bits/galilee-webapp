import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {User} from '../../shared/models/user.model';
import {UserService} from '../../authentication/user.service';

@Injectable()
export class JournalService {

  constructor(private http: Http,
              private userService: UserService) {
  }

  getJournalEntries() {
    let currentUser: User;
    this.userService
      .getCurrentUser()
      .subscribe(user => currentUser = user);
    return this.http.get(`http://localhost:3000/users/${currentUser.email}/journal-entries`)
      .map(res => res.json());
  }
}
