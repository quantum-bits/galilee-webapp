import { Component, OnInit, Input, EventEmitter } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  //FormArray,
  Validators, // used to make a field required
  FormControl
} from '@angular/forms';

import { GroupService } from '../../../shared/services/group.service';

import {Organization} from '../../../shared/models/user.model';

@Component({
  selector: 'app-edit-organization',
  templateUrl: './edit-organization.component.html',
  styleUrls: ['./edit-organization.component.scss']
})
export class EditOrganizationComponent implements OnInit {

  @Input() organizationData: any; // only pass in if updating a current organization; otherwise undefined

  onFinished = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

}
