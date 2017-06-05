import { Component, OnInit } from '@angular/core';

import {PaginationInstance} from '../../../shared/interfaces/pagination-instance.interface';

import { GroupService } from '../../../shared/services/group.service';

import {Group} from '../../../shared/models/user.model';
import {StatusOptions, DisplayFilter} from '../../user-management/manage-users';

/*
To Do:
 - add group
 - edit group
 */


@Component({
  selector: 'app-manage-groups',
  templateUrl: './manage-groups.component.html',
  styleUrls: ['./manage-groups.component.scss']
})
export class ManageGroupsComponent implements OnInit {

  private groups: Group[]; // will stay the same throughout
  private filteredGroups: Group[]; // the list of filtered/sorted users displayed on the page

  public config: PaginationInstance = {//used by pagination component
    //id: 'advanced',
    itemsPerPage: 3,
    currentPage: 1
  };

  private sortableColumns = [
    {
      value: 'name',
      name: 'Group Name'
    },
    {
      value: 'numberMembers',
      name: '# Members'
    },
    {
      value: 'organization',
      name: 'Organization'
    },
    {
      value: 'createdAt',
      name: 'Joined'
    }
  ];

  private filterSelectOptionsDropdown = [
    {
      value: 'name',
      name: 'Group Name'
    },
    {
      value: 'organization',
      name: 'Organization'
    },
    {
      value: 'userFirstName',
      name: 'Group Member First Name'
    },
    {
      value: 'userLastName',
      name: 'Group Member Last Name'
    },
    {
      value: 'userEmail',
      name: 'Group Member Email'
    },
  ];

  private enabledFilterType = { // this doesn't feel quite right, but otherwise can't access it in the template
    ALL: StatusOptions.ALL,
    ONLY: StatusOptions.ONLY,
    ONLYNOT: StatusOptions.ONLYNOT
  };


  private sortColumn = this.sortableColumns[0].value; // used for deciding which column to sort by; can be 'name', 'organization' or 'started'; if '', then do no sorting
  private sortAscending = true;

  private filterBy = this.filterSelectOptionsDropdown[0].value; //used for deciding which property to use for textual filtering
  public filter: string = '';//bound to textual input in template that is used for filtering the list of groups by name, etc.

  private displayEnabled = new DisplayFilter('isEnabled', 'Enabled');

  constructor(private groupService: GroupService) { }

  ngOnInit() {
    this.fetchGroups();
  }

  fetchGroups(){
    this.groupService.getGroups().subscribe(
      groups => {
        //this.permissionTypes = permissions;
        console.log('groups: ', groups)
        this.groups = [];
        groups.forEach(group => {
          this.groups.push(new Group(group));
        });

        console.log(this.groups);

        this.refreshFilteredGroups();
        this.filterList();

        //this.fetchUsers();
      },
      err => console.log("ERROR", err),
      () => console.log("Groups fetched"));
  }


  sortList() {
    this.filteredGroups = this.filteredGroups.sort((n1,n2) => Group.compare(n1, n2, this.sortColumn, this.sortAscending));
  }

  refreshFilteredGroups() {
    // makes a copy of this.filteredGroups that is distinct from this.groups
    this.filteredGroups = this.groups.filter(group => true);
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
      this.filteredGroups = this.groups.filter(item => this.filterTest(item, this.filter, this.filterBy));
    } else {
      this.refreshFilteredGroups();
    }
    // apply 'group enabled' filter, as appropriate....


    this.filteredGroups = this.filteredGroups.filter(group => this.displayEnabled.displayGroup(group));

    this.sortList();
    this.config.currentPage = 1;// need to set the current page to 1, in case the page we are on suddenly doesn't exist anymore....
  }

  filterTest(group:Group, stringFragment: string, filterBy: string) {
    // returns true if the stringFragment is found in the field determined by filterBy
    let returnVal: boolean = false;
    switch(filterBy) {
      case 'name': {
        returnVal = -1 < group[filterBy].toLowerCase().indexOf(stringFragment.toLowerCase());
        break;
      }
      case 'organization': {
        returnVal = -1 < group[filterBy].name.toLowerCase().indexOf(stringFragment.toLowerCase());
        break;
      }
      case 'userFirstName': {
        returnVal = false;
        group.members.forEach(member => {
          if (-1 < member['firstName'].toLowerCase().indexOf(stringFragment.toLowerCase())) {
            returnVal = true;
          }
        });
        break;
      }
      case 'userLastName': {
        returnVal = false;
        group.members.forEach(member => {
          if (-1 < member['lastName'].toLowerCase().indexOf(stringFragment.toLowerCase())) {
            returnVal = true;
          }
        });
        break;
      }
      case 'userEmail': {
        returnVal = false;
        group.members.forEach(member => {
          if (-1 < member['email'].toLowerCase().indexOf(stringFragment.toLowerCase())) {
            returnVal = true;
          }
        });
        break;
      }
    }
    return returnVal;
  }


  onSelect(optionValue){
    // set column name that should be used for filtering;
    // can use ngModel in the template, but the click handler seems to get confused
    // (maybe it gets called before the value is actually changed?) and the list does
    // not end up getting refreshed....  here we are making the change by hand, and
    // it seems to work well
    this.filterBy = optionValue;
    this.filterList();
  }

  onKey(){
    //this.eventCounter+=1;
    this.filterList();
  }

  selectEnabledFilter(newVal) {
    console.log('newVal is: ', newVal);
    this.displayEnabled.setDisplayStatus(newVal);
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

  toggleDiv(i: number) {
    console.log('i = ', i);
    this.filteredGroups[i].divOpen = ! this.filteredGroups[i].divOpen;
  }

  resetFilters() {
    this.config.currentPage = 1;

    this.sortColumn = this.sortableColumns[0].value; // used for deciding which column to sort by;
    this.sortAscending = true;

    this.filterBy = this.filterSelectOptionsDropdown[0].value; //used for deciding which column to use for textual filtering
    this.filter = '';

    this.displayEnabled.resetDisplayStatus();

    this.refreshFilteredGroups();
  }

  openNewGroupModal() {
    //
  }

  openEditGroupModal(group) {
    //
  }

  onPageChange(number: number) {
    console.log('config: ', this.config);
    console.log('page number: ', number);
    this.config.currentPage = number;
  }

}
