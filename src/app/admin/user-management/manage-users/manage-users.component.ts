import { Component, OnInit, ViewChild } from '@angular/core';

import {
  //Compiler,
  ViewContainerRef, //ComponentRef, ComponentFactory,
  ComponentFactoryResolver
} from '@angular/core'

import {TimeAgoPipe} from 'angular2-moment';

import {EditUserComponent} from '../edit-user';

import { EditUserAnchorDirective } from '../edit-user-anchor.directive';


import {DialogComponent} from '../../temp/dialog.component';
import {DialogAnchorDirective} from '../../temp/dialoganchor.directive';


import {User} from '../../../shared/models/user.model';
import {Permission} from '../../../shared/models/permission.model';
import {PaginationInstance} from '../../../shared/interfaces/pagination-instance.interface';
import {PermissionFilter} from '../../../shared/models/permission-filter.model';
import {PermissionFilterType} from '../../../shared/models/permission-filter.model';

import { UserService } from '../../../authentication/user.service';

// WORKING HERE (5/29/17):
// https://www.npmjs.com/package/angular2-materialize
// - add a modal to this page; make sure can open it and close it
// - create a modal-anchor.directive
// - try to instantiate that modal from here (see if it is now in the page)
// - then try to launch it
// - then try to put data in it (edit user component, etc.)


// WORKING HERE:
// - interface for UserAttribute; needs render() attribute (could use moment() for
//   rendering...?)
// - class extends interface and gives it the right method definitions
// - static method for class-level comparisons
// ...or just put a static method on the user class

declare var $: any; // for using jQuery within this angular component


/*
 Dynamically injecting components:
  - https://engineering-game-dev.com/2016/08/19/angular-2-dynamically-injecting-components/
  - https://github.com/angular/angular/issues/10735
 */

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {

  @ViewChild(EditUserAnchorDirective) editUserAnchor: EditUserAnchorDirective;
  // other helpful examples (including sass for styling, async call to server, multiple pagination instances, etc.)
  // using the pagination package: https://github.com/michaelbromley/ng2-pagination

  //@ViewChild(DialogAnchorDirective) dialogAnchor: DialogAnchorDirective;

  //@ViewChild('placeholder', {read: ViewContainerRef}) viewContainerRef;
  //private componentFactory: any;
  //private editUserComponent: any;
  //private editUserComponentRef: any;
  //componentRef: ComponentRef;

  // http://stackoverflow.com/questions/36325212/angular-2-dynamic-tabs-with-user-click-chosen-components/36325468#36325468
  // http://plnkr.co/edit/3dzkMVXe4AGSRhk11TXG?p=preview



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
  public config: PaginationInstance = {//used by pagination component
    id: 'advanced',
    itemsPerPage: 2,
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

  constructor(private userService: UserService,
              private componentFactoryResolver: ComponentFactoryResolver) {
              //compiler: Compiler) {
    //this.componentFactory = componentFactoryResolver.resolveComponentFactory(EditUserComponent);
    //console.log(this.componentFactory);
  }

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
            console.log(users);

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
    console.log('config: ', this.config);
    console.log('page number: ', number);
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

  createNewUser() {
    this.editUserAnchor.viewContainer.clear();
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(EditUserComponent);
    this.editUserAnchor.viewContainer.createComponent(componentFactory).instance;
    //let componentRef = this.editUserAnchor.viewContainer.createComponent(componentFactory);
    //let editUserComponent = componentRef.instance;
    //componentRef.instance;
    //console.log(this.editUserComponent);
  }

  editUser(user: User) {
    this.editUserAnchor.viewContainer.clear();
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(EditUserComponent);
    let componentRef = this.editUserAnchor.viewContainer.createComponent(componentFactory);
    componentRef.instance.userData = user;
    componentRef.instance.updateField = 'name';
    //let componentRef = this.viewContainerRef.createComponent(this.componentFactory, 0);
    // FIXME is it safe to fix these after the fact like this?  how do we know it
    // will get done before OnInit?  Could put it in OnChanges as well, as a back-up;
    // should probably put in a delay, and see if it will fire up OnChanges that way....
    //componentRef.instance.userData = user;
  }


  closeNewUserDialog() {
    this.editUserAnchor.viewContainer.clear();
    //let index = this.editUserAnchor.viewContainer.indexOf(this.editUserComponentRef.hostView);
    //this.editUserAnchor.viewContainer.remove(index);
    //console.log('index: ',index);
  }

  //delete


  /*
  openDialogBox() {
    let the_dialog = this.dialogAnchor.createDialog(DialogComponent).instance;
    the_dialog.title = "Overridden Title";
    the_dialog.message = "I'm an overridden message.";
  }
  */

  /*

  // the approach below works, but doesn't seem to be the standard way to do this...(?)

  addItem(){
    let componentRef = this.viewContainerRef.createComponent(this.componentFactory, 0);

    // FIXME should do some clean-up on the edit-user component upon exit; see here:
    // http://stackoverflow.com/questions/36325212/angular-2-dynamic-tabs-with-user-click-chosen-components/36325468#36325468

  }

  editUser(user: User) {
    let componentRef = this.viewContainerRef.createComponent(this.componentFactory, 0);
    // FIXME is it safe to fix these after the fact like this?  how do we know it
    // will get done before OnInit?  Could put it in OnChanges as well, as a back-up;
    // should probably put in a delay, and see if it will fire up OnChanges that way....
    componentRef.instance.userData = user;
  }
  */
}
