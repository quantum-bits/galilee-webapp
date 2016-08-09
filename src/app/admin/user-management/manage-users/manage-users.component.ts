import { Component, OnInit, Input } from '@angular/core';

import {MaterializeDirective} from 'angular2-materialize';
import {PaginatePipe, PaginationControlsCmp, PaginationService, IPaginationInstance} from 'ng2-pagination';

import { UserManagementService } from '../user-management.service';


@Component({
  moduleId: module.id,
  selector: 'app-manage-users',
  templateUrl: 'manage-users.component.html',
  styleUrls: ['manage-users.component.css'],
  providers: [UserManagementService, PaginationService],
  directives: [MaterializeDirective, PaginationControlsCmp],
  pipes: [PaginatePipe],
})
export class ManageUsersComponent implements OnInit {

  // other helpful examples (including async call to server)
  // using the pagination package: http://michaelbromley.github.io/ng2-pagination/
  // BUG: if change FilterBy, it doesn't recheck the filter...oops!



  private users: any;//use interface(!)
  private filteredUsers: any;//use interface(!)

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

  private filterBy = 'lastName';

  /* the pagination is buggy when I try to change the items per page dynamically....
  private itemsPerPageOptions = [
    {
      value: 2,
      name: '2'
    },
    {
      value: 5,
      name: '5'
    },
    {
      value: 10,
      name: '10'
    },
    {
      value: 20,
      name: '20'
    },
  ]
  */

  constructor(private userManagementService: UserManagementService) {}

  ngOnInit() {
    this.userManagementService.getUsers().subscribe(
      users => {
        this.users = users;
        this.filteredUsers = this.users;
        this.length = this.filteredUsers.length;
        console.log(users);
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
    this.length = this.filteredUsers.length;
  }

  onSelect(optionValue){
    // can use ngModel in the template, but the click handler seems to get confused
    // (maybe it gets called before the value is actually changed?) and the list doesn
    // not end up getting refreshed....  here we are making the change by hand, and
    // it seems to work well
    this.filterBy = optionValue;
    this.filterList();
  }
  
  onPageChange(number: number) {
    console.log('change to page', number);
    this.config.currentPage = number;
  }

}
