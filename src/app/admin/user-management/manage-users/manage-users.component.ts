import { Component, OnInit } from '@angular/core';

import {MaterializeDirective} from 'angular2-materialize';
import {PaginatePipe, PaginationControlsCmp, PaginationService, IPaginationInstance} from 'ng2-pagination';

import {TimeAgoPipe} from 'angular2-moment';

import {EditUserComponent} from '../edit-user';

import {User} from '../../../shared/models/user.model';
import {Permission} from '../../../shared/models/permission.model';
import {PermissionFilter} from '../../../shared/models/permission-filter.model';
import {PermissionFilterType} from '../../../shared/models/permission-filter.model';

import {UserPermission} from '../../../shared/models/user-permission.model';

import { UserService } from '../../../authentication/user.service';

// WORKING HERE:
// - interface for UserAttribute; needs render() attribute (could use moment() for
//   rendering...?)
// - class extends interface and gives it the right method definitions
// - static method for class-level comparisons
// ...or just put a static method on the user class

declare var $: any; // for using jQuery within this angular component

@Component({
  moduleId: module.id,
  selector: 'app-manage-users',
  templateUrl: 'manage-users.component.html',
  styleUrls: ['manage-users.component.css'],
  providers: [UserService, PaginationService],
  directives: [MaterializeDirective, PaginationControlsCmp, EditUserComponent],
  pipes: [PaginatePipe, TimeAgoPipe],
})
export class ManageUsersComponent implements OnInit {

  // other helpful examples (including async call to server)
  // using the pagination package: http://michaelbromley.github.io/ng2-pagination/

  private users: User[]; // will stay the same throughout
  private filteredUsers: User[]; // the list of filtered/sorted users displayed on the page
  private userEnabledChoices = ['all', 'onlyEnabled', 'onlyNonenabled'];
  private viewEnabledUsers = this.userEnabledChoices[0]; // used to filter users that are/are not enabled

  private permissionFilters: PermissionFilter[]; // used to filter the list of users by permissions

  private permissionFilterType = { // this doesn't feel quite right, but otherwise can't access it in the template
    can: PermissionFilterType.can,
    cannot: PermissionFilterType.cannot,
    either: PermissionFilterType.either
  };

  //private eventCounter = 0;
  public maxSize: number = 5;//used by pagination component (max # of pages indicated, including the '...')
  public directionLinks: boolean = true;//used by pagination component
  public autoHide: boolean = false;//used by pagination component
  public config: IPaginationInstance = {//used by pagination component
    id: 'advanced',
    itemsPerPage: 5,
    currentPage: 1
  };

  private sortableColumns = [
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
    },
    {
      value: 'joinedOn',
      name: 'Joined'
    }
  ];
  private filterSelectOptionsDropdown = [
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
    },
  ];

  private sortColumn = this.sortableColumns[3].value; // used for deciding which column to sort by; can be 'lastName', 'firstName', 'email' or 'joinedOn'; if '', then do no sorting
  private sortAscending = true;

  private filterBy = this.filterSelectOptionsDropdown[0].value; //used for deciding which column to use for textual filtering
  public filter: string = '';//bound to textual input in template that is used for filtering the list of users by name, etc.

  constructor(private userService: UserService) {}

  ngOnInit() {
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
        this.userService.getUsers().subscribe(
          users => {
            this.users = users; // these are actual user objects now, along with associated methods
            //create a copy of this.users called this.filteredUsers; this is what will be
            //displayed, etc.
            this.refreshFilteredUsers();
            //this.filteredUsers = this.users;
            // may need to build the filteredUsers list up from scratch...?!?
            this.filterList();//sorts this.filteredUsers, but not this.users (since they are distinct in memory)
          },
          err => console.log("ERROR", err),
          () => console.log("Users fetched"));
      },
      err => console.log("ERROR", err),
      () => console.log("Permission types fetched"));
  }

  onKey(){
    //this.eventCounter+=1;
    this.filterList();
  }

  refreshFilteredUsers(){
    // makes a copy of this.filteredUsers that is distinct from this.users
    this.filteredUsers = this.users.filter(user => true);
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
      this.refreshFilteredUsers();
    }
    // apply 'user enabled' filter, as appropriate....
    if (this.viewEnabledUsers !== this.userEnabledChoices[0]){// not 'all'
      if (this.viewEnabledUsers === this.userEnabledChoices[1]){// 'onlyEnabled'
        this.filteredUsers = this.filteredUsers.filter(user => user.isEnabled());
      } else { // 'onlyNonenabled'
        this.filteredUsers = this.filteredUsers.filter(user => !user.isEnabled());
      }
    }
    // apply permission filters, as appropriate....
    for (let permissionFilter of this.permissionFilters) {
      if (permissionFilter.filter !== PermissionFilterType.either){// not 'either'
        if (permissionFilter.filter === PermissionFilterType.can){// 'only those with the permission'
          this.filteredUsers = this.filteredUsers.filter(user => user.can(permissionFilter.id));
        } else { // 'onlyNonenabled'
          this.filteredUsers = this.filteredUsers.filter(user => !user.can(permissionFilter.id));
        }
      }
    }
    this.sortList();
    this.config.currentPage = 1;// need to set the current page to 1, in case the page we are on suddenly doesn't exist anymore....
  }

  sortList() {
    this.filteredUsers = this.filteredUsers.sort((n1,n2) => User.compare(n1, n2, this.sortColumn, this.sortAscending));
  }


  onSelect(optionValue){
    // set column name that should be used for filtering;
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
    this.filterList();
  }

  onPageChange(number: number) {
    this.config.currentPage = number;
  }

  resetFilters(){
    this.config.currentPage = 1;

    this.sortColumn = this.sortableColumns[3].value; // used for deciding which column to sort by; can be 'lastName', 'firstName', 'email' or 'joinedOn'; if '', then do no sorting
    this.sortAscending = true;

    this.filterBy = this.filterSelectOptionsDropdown[0].value; //used for deciding which column to use for textual filtering
    this.filter = '';

    for (let i in this.permissionFilters) {
      this.permissionFilters[i].filter = PermissionFilterType.either;
    }
    this.refreshFilteredUsers();
  }

  onModalFinished(modalID: string){
    // Note: must include the following declaration (above) in component:
    //          declare var $: any;
    console.log('about to close the modal....');
    console.log('#'+modalID);
    $('#'+modalID).closeModal();
  }

  logUserLists(){
    console.log(this.users);
    console.log(this.filteredUsers);
  }


}
