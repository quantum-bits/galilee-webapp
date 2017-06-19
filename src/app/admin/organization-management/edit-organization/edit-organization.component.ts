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

  private isNewOrganization: boolean = true;
  public organizationForm: FormGroup; // our model driven form

  constructor(private formBuilder: FormBuilder,
              private groupService: GroupService) { }

  ngOnInit() {
    if (this.organizationData === undefined){
      this.isNewOrganization = true;
    } else {
      this.isNewOrganization = false;
    }

    this.initializeForm();
    this.createOrganizationForm();

  }


  initializeForm() {
    if (this.isNewOrganization) {
      this.createEmptyOrganizationData(); // fills organizationData with initial values
      console.log(this.organizationData);
    }
  }

  createEmptyOrganizationData() {
    this.organizationData = {
      id: null,//this will be assigned by the server-side code later
      name: '',
      created_at: null, //TODO: fix...created_at -> createdAt
      updated_at: null  //TODO: fix...updated_at -> updatedAt
    };
  }

  createOrganizationForm(){
    this.organizationForm = this.formBuilder.group({
      name: [this.organizationData.name, [<any>Validators.required]]
    });
  }

  onSubmit() {
    // pull data out of the form, etc.
    // QUESTION: do we want to have any sort of checking to make sure that
    // that there aren't two organizations with the same name?!?
  }


}
