import { Component, OnInit, Input } from '@angular/core';

import {MaterializeDirective} from 'angular2-materialize';
import {PaginatePipe, PaginationControlsCmp, PaginationService, IPaginationInstance} from 'ng2-pagination';

import {EditUserComponent} from '../edit-user';

import {User} from '../../../shared/models/user.model';
import {Permission} from '../../../shared/models/permission.model';
import {PermissionFilter} from '../../../shared/models/permission-filter.model';
import {PermissionFilterType} from '../../../shared/models/permission-filter.model';

import {UserPermission} from '../../../shared/models/user-permission.model';

import { UserService } from '../../../authentication/user.service';


@Component({
  moduleId: module.id,
  selector: 'app-manage-users',
  templateUrl: 'manage-users.component.html',
  styleUrls: ['manage-users.component.css'],
  providers: [UserService, PaginationService],
  directives: [MaterializeDirective, PaginationControlsCmp, EditUserComponent],
  pipes: [PaginatePipe],
})
export class ManageUsersComponent implements OnInit {

  // other helpful examples (including async call to server)
  // using the pagination package: http://michaelbromley.github.io/ng2-pagination/

  private users: User[];

  private user1: User;

  private filteredUsers: User[];//use interface(!)
  private userEnabledChoices = ['all', 'onlyEnabled', 'onlyNonenabled'];
  private viewEnabledUsers = this.userEnabledChoices[0];

  private showHidden = true;

  //private permissionTypes: Permission[];
  private permissionFilters: PermissionFilter[];

  private permissionFilterType = { // this doesn't feel quite right, but otherwise can't access it in the template
    can: PermissionFilterType.can,
    cannot: PermissionFilterType.cannot,
    either: PermissionFilterType.either
  };

  /*
  private initialUser: User = {
    id: 0, // this will eventually need to be managed by the server-side code
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    joinedOn: '',
    enabled: true,
    preferredVersionID: 0,
    permission: []
  }
  */

  @Input('data') meals: string[] = [];

  private eventCounter = 0;
  public filter: string = '';
  public maxSize: number = 5;
  public directionLinks: boolean = true;
  public autoHide: boolean = false;
  public config: IPaginationInstance = {
    id: 'advanced',
    itemsPerPage: 5,
    currentPage: 1
  };
  private length: number;

  private filterSelectOptions = [
    {
      value: 'lastName',
      name: 'Last Name'
    },
    {
      value: 'firstName',
      name: 'First Name'
    },
    {
      value: 'email',
      name: 'Email'
    }
  ];
  private sortColumn = this.filterSelectOptions[0].value; // can be 'lastName', 'firstName', 'email'; if '', then do no sorting
  private sortAscending = true;


  private filterBy = 'lastName';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUsers().subscribe(
      users => {
        this.users = users;
        console.log('inside the component now');
        console.log(this.users);
        console.log(this.users[0].can('EDIT_RES'));
        //this.filteredUsers = this.users;

/*
        this.users = [];
        for (let user of users) {
          let userPermissions: UserPermission[] = [];
          for (let permission of user.permissions) {
            userPermissions.push(new UserPermission(
                {
                  enabled: permission.enabled,
                  id: permission.id,
                  title: permission.title
                }
              )
            )
          };

          this.users.push(new User(
            {
              id: user.id,
              email: user.email,
              password: user.password,
              firstName: user.firstName,
              lastName: user.lastName,
              joinedOn: user.joinedOn,
              enabled: user.enabled,
              preferredVersionID: user.preferredVersionID,
              permissions: userPermissions
            })
          )
        }

        console.log('user objects coming up....');
        console.log(this.users);
        console.log(this.users[0]);
        console.log(this.users[0].can('EDIT_RES'));
        console.log(this.users[0].can('EDIT_PRAC'));
        console.log(this.users[0].can('EDIT_ADMIN'));

        console.log(this.users[1].can('EDIT_RES'));
        console.log(this.users[1].can('EDIT_PRAC'));
        console.log(this.users[1].can('EDIT_ADMIN'));

*/
        this.filteredUsers = this.users;
        // may need to build the filteredUsers list up from scratch...?!?


        this.sortList();

        console.log(this.filteredUsers);

        this.length = this.filteredUsers.length;

        this.user1 = this.users[0];
        console.log('user1:');
        console.log(this.user1);


        console.log('user objects coming up again....');
        console.log(this.users);
        console.log(this.users[0]);


        //console.log(this.user1.isEnabled());

        this.userService.getPermissionTypes().subscribe(
          permissions => {
            //this.permissionTypes = permissions;
            this.permissionFilters = [];

            for (let i in permissions) {
              this.permissionFilters.push(
                {
                  id: permissions[i].id,
                  title: permissions[i].title,
                  filter: PermissionFilterType.either
                }
              );
            }
            console.log(this.permissionFilterType);
            console.log(this.permissionFilters);
          },
          err => console.log("ERROR", err),
          () => console.log("Permission types fetched"));
      },
      err => console.log("ERROR", err),
      () => console.log("Users fetched"));
  }

  onKey(){
    this.eventCounter+=1;
    console.log(this.eventCounter);
    console.log(this.filter);
    this.filterList();
  }

  filterList(){
    /*
     Applies a string filter; slightly modified from:
        https://github.com/michaelbromley/ng2-pagination/blob/master/demo/src/string-filter-pipe.ts
     ...also applies filters on the users' permissions and on whether or not the user is 'enabled'
     NOTE: The Angular 2 documentation recommends against using a pipe for
           filtering or sorting (see: https://angular.io/docs/ts/latest/guide/pipes.html#!#no-filter-pipe);
           instead, the recommendation is to do it in the component or service itself....
     */
    if (this.filter !== '') {
      this.filteredUsers = this.users.filter(item => -1 < item[this.filterBy].toLowerCase().indexOf(this.filter.toLowerCase()));
    } else {
      this.filteredUsers = this.users;
    }
    // apply 'user enabled' filter, as appropriate....
    if (this.viewEnabledUsers !== this.userEnabledChoices[0]){// not 'all'
      if (this.viewEnabledUsers === this.userEnabledChoices[1]){// 'onlyEnabled'
        this.filteredUsers = this.filteredUsers.filter(item => item.enabled);
      } else { // 'onlyNonenabled'
        this.filteredUsers = this.filteredUsers.filter(item => !item.enabled);
      }
    }
    // apply permission filters, as appropriate....
    for (let permissionFilter of this.permissionFilters) {
      if (permissionFilter.filter !== PermissionFilterType.either){// not 'either'
        if (permissionFilter.filter === PermissionFilterType.can){// 'only those with the permission'
          this.filteredUsers = this.filteredUsers.filter(user => this.userHasPermission(user, permissionFilter));
        } else { // 'onlyNonenabled'
          this.filteredUsers = this.filteredUsers.filter(user => !this.userHasPermission(user, permissionFilter));
        }
      }
    }

    this.length = this.filteredUsers.length;
    this.sortList();
    this.config.currentPage = 1;// need to set the current page to 1, in case the page we are on suddenly doesn't exist anymore....
  }


  userHasPermission(user: User, permissionFilter) {
    var index;
    for (let i in user.permissions){
      if (user.permissions[i].id === permissionFilter.id) {
        index = i;
      }
    }
    if (index !== undefined) {
      return user.permissions[index].enabled;
    }
  }

  sortList() {
    var sortedArray = this.filteredUsers.sort((n1,n2) => this.compareObjects(n1, n2, this.sortColumn, this.sortAscending));
    this.filteredUsers = sortedArray;
  }

  compareObjects(element1, element2, field: string, sortAscending: boolean) {
    // helpful: http://stackoverflow.com/questions/21687907/typescript-sorting-an-array
    var returnVal = 0;
    if (element1[field].toLowerCase() > element2[field].toLowerCase()) {
      returnVal = 1;
    }
    if (element1[field].toLowerCase() < element2[field].toLowerCase()) {
      returnVal = -1;
    }
    if (!sortAscending) {
      returnVal = - returnVal;
    }
    return returnVal;
  }


  onSelect(optionValue){
    // can use ngModel in the template, but the click handler seems to get confused
    // (maybe it gets called before the value is actually changed?) and the list doesn
    // not end up getting refreshed....  here we are making the change by hand, and
    // it seems to work well
    this.filterBy = optionValue;
    this.filterList();
  }

  toggleSort(heading: string) {
    // toggling is asc > desc > off > asc ....
    if (this.sortColumn !== heading) {//currently not sorting on any column, or sorting on a diff column
      this.sortColumn = heading;
      this.sortAscending = true;
      this.sortList();
    } else { //already sorting on this column, so toggle sort direction
      if (this.sortAscending === true) {
        this.sortAscending = false;
        this.sortList();
      } else if (this.sortAscending === false) {
        this.sortColumn = ''; //turn sorting off
      }
    }
  }

  toggleEnabled() {
    var index = this.userEnabledChoices.indexOf(this.viewEnabledUsers);
    index++;
    if (index == this.userEnabledChoices.length) {index = 0};
    this.viewEnabledUsers = this.userEnabledChoices[index];
    this.filterList();
  }

  //
  selectPermissionFilter(permissionFilter, permissionFilterTypeValue){
    var index;
    for (let i in this.permissionFilters) {
      if (this.permissionFilters[i].id === permissionFilter.id) {
        index = i;
      }
    }
    if (index !== undefined) {
      this.permissionFilters[index].filter = permissionFilterTypeValue;
    }
    console.log(this.permissionFilters);
    this.filterList();
  }

  togglePermission(permissionTypeID: string) {}

  /*
  togglePermission(permissionTypeID: string) {
    var permissionIndex: any;
    for (let i in this.permissionTypes) {
      if (this.permissionTypes[i].id === permissionTypeID) {
        permissionIndex = i;
      }
    }
    if (permissionIndex !== undefined) {
      this.permissionTypes[permissionIndex].filter = !this.permissionTypes[permissionIndex].filter;
    }
    console.log(this.permissionTypes);
  }
  */


  onPageChange(number: number) {
    console.log('change to page', number);
    this.config.currentPage = number;
  }

  onModalFinished(event) {
    //see update-resources component for an example....
  }




}
