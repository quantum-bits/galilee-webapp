import { Component, OnInit, Input } from '@angular/core';

import {MaterializeDirective} from 'angular2-materialize';
import {PaginatePipe, PaginationControlsCmp, PaginationService, IPaginationInstance} from 'ng2-pagination';

import {User} from '../../../shared/models/user.model';
import {Permission} from '../../../shared/models/permission.model';
import {PermissionFilter} from '../../../shared/models/permission-filter.model';
import {PermissionFilterType} from '../../../shared/models/permission-filter.model';

import { UserService } from '../../../authentication/user.service';

/*
const enum permissionFilterTypes {
  can,
  cannot,
  either
}
*/

@Component({
  moduleId: module.id,
  selector: 'app-manage-users',
  templateUrl: 'manage-users.component.html',
  styleUrls: ['manage-users.component.css'],
  providers: [UserService, PaginationService],
  directives: [MaterializeDirective, PaginationControlsCmp],
  pipes: [PaginatePipe],
})
export class ManageUsersComponent implements OnInit {

  // other helpful examples (including async call to server)
  // using the pagination package: http://michaelbromley.github.io/ng2-pagination/

  // WORKING HERE....
  // permission class: title and id (const)
  // userpermission extends permission ...it gets an 'enabled' field as well
  // filterpermission extends permission...it gets a filter ENUM as well
  // 3-way state for ENUM is: 'can' 'cannot' 'either'

  private users: User[];
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

  @Input('data') meals: string[] = [];

  private sortColumn = 'lastName'; // can be 'lastName', 'firstName' or 'email'
  private sortAscending = true;

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

  private filterBy = 'lastName';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUsers().subscribe(
      users => {
        this.users = users;
        this.filteredUsers = this.users;
        this.sortList();
        this.length = this.filteredUsers.length;

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
     A string filter; slightly modified from:
        https://github.com/michaelbromley/ng2-pagination/blob/master/demo/src/string-filter-pipe.ts
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

    if (this.viewEnabledUsers !== this.userEnabledChoices[0]){// 'all'
      if (this.viewEnabledUsers === this.userEnabledChoices[1]){// 'onlyEnabled'
        this.filteredUsers = this.filteredUsers.filter(item => item.enabled);
      } else { // 'onlyNonenabled'
        this.filteredUsers = this.filteredUsers.filter(item => !item.enabled);
      }
    }



    this.length = this.filteredUsers.length;
    this.sortList();
    this.config.currentPage = 1;// need to set the current page to 1, in case the page we are on suddenly doesn't exist anymore....
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

  selectPermissionFilter(permissionFilter, permissionFilterType){
    console.log(permissionFilter);
    console.log(permissionFilterType);

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

}
