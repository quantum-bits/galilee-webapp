import { Component, OnInit, EventEmitter } from '@angular/core';

import {MaterializeAction} from 'angular2-materialize';

import { GroupService } from '../../../shared/services/group.service';
import {EditOrganizationComponent} from '../edit-organization';




@Component({
  selector: 'app-edit-organization-modal',
  templateUrl: './edit-organization-modal.component.html',
  styleUrls: ['./edit-organization-modal.component.scss']
})
export class EditOrganizationModalComponent implements OnInit {

  modalActions = new EventEmitter<string|MaterializeAction>();

  organizationData: any;

  constructor(private groupService: GroupService) { }

  ngOnInit() {
    console.log('inside EditOrganizationModalComponent; organizationData: ', this.organizationData);
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
    let refreshOrganizations: boolean = false;
    this.groupService.announceCloseAndCleanUpOrganizations(refreshOrganizations);
  }

}
