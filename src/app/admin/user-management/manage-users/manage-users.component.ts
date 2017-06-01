import { Component, OnInit, OnDestroy, ViewChild, EventEmitter } from '@angular/core';

import {
  //Compiler,
  ViewContainerRef, //ComponentRef, ComponentFactory,
  ComponentFactoryResolver,
  ReflectiveInjector
} from '@angular/core'

import { Subscription }   from 'rxjs/Subscription';

import {TimeAgoPipe} from 'angular2-moment';

import {EditUserComponent} from '../edit-user';
import {EditUserModalComponent} from '../edit-user-modal';

import { EditUserAnchorDirective } from '../edit-user-anchor.directive';
import { EditUserModalAnchorDirective } from '../edit-user-modal-anchor.directive';

import {MaterializeAction} from 'angular2-materialize';


import {DialogComponent} from '../../temp/dialog.component';
import {DialogAnchorDirective} from '../../temp/dialoganchor.directive';


import {User} from '../../../shared/models/user.model';
import {Permission} from '../../../shared/models/permission.model';
import {PaginationInstance} from '../../../shared/interfaces/pagination-instance.interface';
import {PermissionFilter} from '../../../shared/models/permission-filter.model';
import {PermissionFilterType} from '../../../shared/models/permission-filter.model';

import { UserService } from '../../../authentication/user.service';

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

export enum StatusOptions {
  ALL = 0, // show all users, regardless of the property in question
  ONLY, // show only users that have the property in question
  ONLYNOT // show only the users who do not have the property in question
}

export class UserDisplayProperty {

  displayStatus: number; //status of displayfor this property
  functionName: string; //name of method to check to see whether the User does in fact have this property
  customText: string[]; //custom text to show for 'all', 'only' and 'only not' cases, respectively

  constructor(functionName: string,
              customText: string[]){
    this.displayStatus = StatusOptions.ALL;
    this.functionName = functionName;
    this.customText = customText;
  }

  incrementDisplayStatus(){
    switch(this.displayStatus) {
      case StatusOptions.ALL: {
        this.displayStatus = StatusOptions.ONLY;
        break;
      }
      case StatusOptions.ONLY: {
        this.displayStatus = StatusOptions.ONLYNOT;
        break;
      }
      case StatusOptions.ONLYNOT: {
        this.displayStatus = StatusOptions.ALL;
        break;
      }
      default: {
        this.displayStatus = StatusOptions.ALL;
      }
    }
  }

  getDisplayStatus() {
    return this.displayStatus;
  }

  getCustomText() {
    return this.customText[this.displayStatus];
  }

  // see: https://stackoverflow.com/questions/29822773/passing-class-method-as-parameter-in-typescript
  userHasProperty(user: User) {
    if (user[this.functionName] && user[this.functionName] instanceof Function) {
      return user[this.functionName]();
    } else {
      throw new Error("Function '" + this.functionName + "' is not a valid function");
    }
  }

  displayUser(user: User) {
    return (this.displayStatus === StatusOptions.ALL) ||
      ((this.displayStatus === StatusOptions.ONLY) && (this.userHasProperty(user))) ||
      ((this.displayStatus === StatusOptions.ONLYNOT) && (!this.userHasProperty(user)));
  }

}


@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit, OnDestroy {

  @ViewChild(EditUserAnchorDirective) editUserAnchor: EditUserAnchorDirective;
  @ViewChild(EditUserModalAnchorDirective) editUserModalAnchor: EditUserModalAnchorDirective;
  // other helpful examples (including sass for styling, async call to server, multiple pagination instances, etc.)
  // using the pagination package: https://github.com/michaelbromley/ng2-pagination

  // http://stackoverflow.com/questions/36325212/angular-2-dynamic-tabs-with-user-click-chosen-components/36325468#36325468
  // http://plnkr.co/edit/3dzkMVXe4AGSRhk11TXG?p=preview


  modalActions = new EventEmitter<string|MaterializeAction>();
  subscription: Subscription;

  private modalComponent: any;

  private users: User[]; // will stay the same throughout
  private filteredUsers: User[]; // the list of filtered/sorted users displayed on the page

  private displayEnabled = new UserDisplayProperty('isEnabled', ['Enabled?', 'Enabled (only)', 'Not Enabled']);
  private displayInGroups = new UserDisplayProperty('inGroups', ['Group(s)?', 'Groups (only)', 'No Group']);

  private permissionFilters: PermissionFilter[]; // used to filter the list of users by permissions

  private permissionFilterType = { // this doesn't feel quite right, but otherwise can't access it in the template
    can: PermissionFilterType.can,
    cannot: PermissionFilterType.cannot,
    either: PermissionFilterType.either
  };


  //private eventCounter = 0;
  //public directionLinks: boolean = false;//used by pagination component
  //public autoHide: boolean = true;//used by pagination component
  public config: PaginationInstance = {//used by pagination component
    //id: 'advanced',
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

  constructor(private userService: UserService,
              private componentFactoryResolver: ComponentFactoryResolver) {
    this.subscription = this.userService.closeAndCleanUp$.subscribe(
      refreshUsers => {
        console.log('received word from modal...!  Refresh Users?', refreshUsers);
        this.modalCloseAndCleanUp(refreshUsers);
      });
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
        this.fetchUsers();
      },
      err => console.log("ERROR", err),
      () => console.log("Permission types fetched"));
  }

  fetchUsers() {
    console.log('fetching user data....');
    this.userService.getUsers().subscribe(
      users => {
        this.users = [];
        users.forEach(user => {
          this.users.push(new User(user));
        });

        console.log('user is enabled: ',this.displayEnabled.userHasProperty(this.users[0]));
        console.log('user is in groups: ',this.displayInGroups.userHasProperty(this.users[0]));



        //private displayInGroups = new UserDisplayProperty(0, 'inGroups');




        // these are actual user objects now, along with associated methods
        //create a copy of this.users called this.filteredUsers; this is what will be
        //displayed, etc.
        this.refreshFilteredUsers();
        //this.filteredUsers = this.users;
        // may need to build the filteredUsers list up from scratch...?!?
        this.filterList();//sorts this.filteredUsers, but not this.users (since they are distinct in memory)
      },
      err => console.log("ERROR", err),
      () => console.log("Users fetched"));
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
    // apply 'user enabled' and 'user in group(s)' filter, as appropriate....

    this.filteredUsers = this.filteredUsers.filter(user => this.displayEnabled.displayUser(user));
    this.filteredUsers = this.filteredUsers.filter(user => this.displayInGroups.displayUser(user));

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
    this.displayEnabled.incrementDisplayStatus();
    this.filterList();
  }

  toggleInGroups() {
    this.displayInGroups.incrementDisplayStatus();
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

  logUserLists(){
    console.log(this.users);
    console.log(this.filteredUsers);
  }

  openNewUserModal() {
    this.editUserModalAnchor.viewContainer.clear();
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(EditUserModalComponent);
    this.modalComponent = this.editUserModalAnchor.viewContainer.createComponent(componentFactory).instance;
  }

  openEditUserModal(user: User) {
    console.log('inside openEditUserModal');
    this.editUserModalAnchor.viewContainer.clear();

    /*

    NOTE:
      another approach to passing along the userData would be to use an
      injector; in this case, the edit-user-component would need to get
      the information from the injector (inside its constructor)....
      for injecting inputs, see: http://blog.rangle.io/dynamically-creating-components-with-angular-2/
      ...it would be something like this:
      constructor(private injector: Injector) {
        this.userData = this.injector.get('userData');
      }
      ...but then this would presumably gag when trying to instantiate this component
      without using the injector....


    let inputs = {
      userData: user,
      updateField: 'name'
    }

    console.log('inputs: ', inputs);

    // Inputs need to be in the following format to be resolved properly
    let inputProviders = Object.keys(inputs).map((inputName) => {return {provide: inputName, useValue: inputs[inputName]};});
    let resolvedInputs = ReflectiveInjector.resolve(inputProviders);

    console.log('inputProviders: ', inputProviders);
    console.log('resolvedInputs: ', resolvedInputs);
    // We create an injector out of the data we want to pass down and this components injector
    let injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.editUserModalAnchor.viewContainer.parentInjector);

    // We create a factory out of the component we want to create
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(EditUserModalComponent);

    // We create the component using the factory and the injector
    let component = componentFactory.create(injector);

    // We insert the component into the dom container
    this.editUserModalAnchor.viewContainer.insert(component.hostView);

    // Destroy the previously created component
    //if (this.currentComponent) {
    //  this.currentComponent.destroy();
    //}

    //this.currentComponent = component;

    this.modalComponent = component;
    */


    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(EditUserModalComponent);
    this.modalComponent = this.editUserModalAnchor.viewContainer.createComponent(componentFactory).instance;
    // fix the @Input() values....
    this.modalComponent.userData = user;
    this.modalComponent.updateField = 'name';

    // FIXME is it safe to fix these after the fact like this?  how do we know it
    // will get done before OnInit?
    // ...I have checked, and the inputs seem to be correctly fixed by the time
    // ngOnInit runs, but is that guaranteed...?!?
  }


  modalCloseAndCleanUp(refreshUsers: boolean){
    // close the modal and then clear the viewContainer
    this.modalComponent.closeModal();
    this.editUserModalAnchor.viewContainer.clear();
    if (refreshUsers) {
      this.fetchUsers();
    }
    // now...how to make page refresh...?!?
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }


}
