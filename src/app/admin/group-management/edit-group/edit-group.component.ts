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

  private users: User[];

  private haveUsers: boolean = false;

  private selectedUsers: User[] = [];

  constructor(private formBuilder: FormBuilder,
              private groupService: GroupService,
              private userService: UserService) { }

  ngOnInit() {

    this.fetchOrganizations();
    this.fetchUsers();

    if (this.groupData === undefined){
      this.isNewGroup = true;
    } else {
      this.isNewGroup = false;
    }
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
    this.userService.getUsers().subscribe(
      users => {
        this.users = [];
        users.forEach(user => {
          this.users.push(new User(user));
        });
        // these are actual user objects now, along with associated methods
        //create a copy of this.users called this.filteredUsers; this is what will be
        //displayed, etc.
        this.haveUsers = true;
        console.log(this.users);
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


      /*
      email: [this.userData.email, Validators.compose([<any>Validators.required, this.emailValidator])],
      passwords: this.formBuilder.group({
        password: ['', Validators.compose([<any>Validators.required, this.passwordValidator, this.passwordWhitespaceValidator])],
        password2: ['', Validators.compose([<any>Validators.required, this.passwordValidator, this.passwordWhitespaceValidator])]
      }, {validator: this.areEqual}),
      firstName: [this.userData.firstName, [<any>Validators.required]],
      lastName: [this.userData.lastName, [<any>Validators.required]],
      enabled: [true, [<any>Validators.required]],
      preferredVersionId: [this.userData.preferredVersionId],
      permissions: this.formBuilder.array(
        this.initPermissionArray(this.userData.permissions, this.permissionTypes)),

    */

    });

  }

  onSelectionChange(users: User[]) {
    this.selectedUsers = users;
    console.log(this.selectedUsers);
  }

  onSubmit() {
    //
  }


}
