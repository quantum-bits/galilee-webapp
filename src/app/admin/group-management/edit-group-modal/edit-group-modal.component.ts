import { Component, OnInit, EventEmitter } from '@angular/core';

import {MaterializeAction} from 'angular2-materialize';

import { GroupService } from '../../../shared/services/group.service';
import {EditGroupComponent} from '../edit-group';


@Component({
  selector: 'app-edit-group-modal',
  templateUrl: './edit-group-modal.component.html',
  styleUrls: ['./edit-group-modal.component.scss']
})
export class EditGroupModalComponent implements OnInit {

  modalActions = new EventEmitter<string|MaterializeAction>();

  private groupData: any;

  constructor(private groupService: GroupService) { }

  ngOnInit() {
    console.log('inside EditGroupModalComponent; groupData: ', this.groupData);
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
    let refreshGroups: boolean = false;
    this.groupService.announceCloseAndCleanUp(refreshGroups);
  }

}
