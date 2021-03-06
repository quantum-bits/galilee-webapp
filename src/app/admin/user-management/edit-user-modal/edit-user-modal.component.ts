import { Component, OnInit, EventEmitter } from '@angular/core';

import {MaterializeAction} from 'angular2-materialize';

import {EditUserComponent} from '../edit-user';

import { UserService } from '../../../authentication/user.service';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss']
})
export class EditUserModalComponent implements OnInit {

  modalActions = new EventEmitter<string|MaterializeAction>();

  userData: any = null;
  updateField: string = null ;

  constructor(private userService: UserService) { }

  ngOnInit() {
    console.log('inside ngoninit for EditUserModalComponent');
    console.log('userData is: ', this.userData);
    console.log('updateField is: ', this.updateField);
  }

  openModal() {
    // note that we open the modal programmatically upon initialization
    // (from within the template); see: https://github.com/InfomediaLtd/angular2-materialize/issues/209
    this.modalActions.emit({action:"modal",params:['open']});
  }

  closeModal() {
    this.modalActions.emit({action:"modal",params:['close']});
  }

  cancel() {
    // could close the modal directly here, but need to both close
    // the modal and delete the component itself, so we let the
    // manage-users component take care of everything....
    let refreshUsers: boolean = false;
    this.userService.announceCloseAndCleanUp(refreshUsers);
  }

}
