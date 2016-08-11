import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {User} from '../../../shared/models/user.model';

@Component({
  moduleId: module.id,
  selector: 'app-edit-user',
  templateUrl: 'edit-user.component.html',
  styleUrls: ['edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  @Input() newUser: boolean; //true if this is a new user; false if editing an existing user
  @Input() modalID: string;
  @Input() user: User;
  @Output() onFinished = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {
  }

}


/*
 [newUser]="true"
 [modalID]="'modalAddNewUser'"
 (onFinished)="onModalFinished($event)"
 [user]="initialUser">
 */
