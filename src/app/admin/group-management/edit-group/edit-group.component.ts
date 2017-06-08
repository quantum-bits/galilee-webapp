import { Component, OnInit, Input, EventEmitter } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators, // used to make a field required
  FormControl
} from '@angular/forms';

import {UserSelectComponent} from '../user-select/user-select.component';


import { UserService } from '../../../authentication/user.service';
import { GroupService } from '../../../shared/services/group.service';

import {User, Group, Organization} from '../../../shared/models/user.model';

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})
export class EditGroupComponent implements OnInit {

  @Input() groupData: Group; // only pass in if updating a current user; otherwise undefined

  onFinished = new EventEmitter<string>();
  private isNewGroup: boolean = true;
  public groupForm: FormGroup; // our model driven form

  private organizations: Organization[] = [];
  private haveOrganizations: boolean = false;

  private allUsers: User[];

  private haveUsers: boolean = false;

  private selectedUsers: User[] = [];
  private initialMemberIds: number[] = [];

  constructor(private formBuilder: FormBuilder,
              private groupService: GroupService,
              private userService: UserService) { }

  ngOnInit() {
    if (this.groupData === undefined){
      this.isNewGroup = true;
    } else {
      this.isNewGroup = false;
      this.groupData.members.forEach(user => this.initialMemberIds.push(user.id));
    }

    console.log('initialMemberIds: ', this.initialMemberIds);
    this.fetchOrganizations();
    this.fetchUsers();

    this.initializeForm();
    this.createGroupForm();

  }

  fetchOrganizations() {
    this.groupService.getOrganizations().subscribe(
      organizations => {
        console.log('orgs: ', organizations)
        this.organizations = [];
        organizations.forEach(organization => {
          //this.groups.push(new Group(group));
          this.organizations.push(organization);
        });
        this.haveOrganizations = true;
      })
  }

  fetchUsers() {
    console.log('fetching user data....');
    // TODO: when the list of users gets large, may want to only fetch
    //       select users (maybe based on the search filter in the form)
    this.userService.getUsers().subscribe(
      users => {
        this.allUsers = [];
        users.forEach(user => {
          this.allUsers.push(new User(user));
          if (!this.isNewGroup) {
            // TODO: when the list of users gets larger, may want to retrieve
            //       the data for the users in groupData.members directly from the server
            for (let id of this.initialMemberIds) {
              if (id === user.id) {
                this.selectedUsers.push(new User(user));
              }
            }
          }
        });
        // these are actual user objects, along with associated methods
        this.haveUsers = true;
        console.log(this.allUsers);
        console.log(this.selectedUsers);
      },
      err => console.log("ERROR", err),
      () => console.log("Users fetched"));
  }


  initializeForm() {

    if (this.isNewGroup) {
      this.createEmptyGroupData(); // fills groupData with initial values
      console.log(this.groupData);
    }

  }

  createEmptyGroupData() {
    this.groupData = new Group({
      id: null,//this will be assigned by the server-side code later
      name: '',
      createdAt: null,//this will be assigned by the server-side code later
      enabled: true,
      organization: {
        id: null,
        name: '',
        created_at: '', //TODO: fix (createdAt)
        updated_at: '' //TODO: fix (createdAt)
      },
      members: []
    });
  }

  createGroupForm(){
    this.groupForm = this.formBuilder.group({
      name: [this.groupData.name, [<any>Validators.required]],
      organizationId: [this.groupData.organization.id, [<any>Validators.required]],
    });

  }

  onSelectionChange(users: User[]) {
    this.selectedUsers = users;
    console.log(this.selectedUsers);
  }

  onSubmit() {
    // pull data out of the form and out of this.selectedUsers;
    // should double-check that no user appears twice by accident
  }


}
