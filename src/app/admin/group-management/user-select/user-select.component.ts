import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {UserEntryComponent} from '../user-entry/user-entry.component';

import {User} from '../../../shared/models/user.model';


@Component({
  selector: 'app-user-select',
  templateUrl: './user-select.component.html',
  styleUrls: ['./user-select.component.scss']
})
export class UserSelectComponent implements OnInit {

  @Input() allUsers: User[];
  @Input() selectedUsers: User[] = [];
  @Output() onSelectionChange = new EventEmitter<User[]>();

  private filteredUsers: User[];
  private unselectedUsers: User[];

  private haveUsers: boolean = false;

  private filter: string = '';

  //private selectedIds: number[] = [];
  private highlightedNotSelectedIds: number[] = [];
  private highlightedSelectedIds: number[] = [];

  private rightArrowHovered: boolean = false;
  private leftArrowHovered: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log('all users? ', this.allUsers);
    console.log('selected users? ', this.selectedUsers);
    if (this.allUsers && !this.haveUsers) {
      this.haveUsers = true;//make sure we don't accidentally refresh the list part way through....
      this.unselectedUsers = this.allUsers;
      this.refreshFilteredUsers();
      this.filterList();//sorts this.filteredUsers, but not this.allUsers (since they are distinct in memory)
    }
  }

  onKey(){
    //this.eventCounter+=1;
    this.filterList();
  }

  refreshFilteredUsers(){
    // makes a copy of this.filteredUsers that is distinct from this.allUsers
    this.filteredUsers = this.unselectedUsers.filter(user => true);
  }

  popUserFromUnselected(userId: number) {
    this.unselectedUsers = this.unselectedUsers.filter(user => !this.userIdMatches(user, userId));
    this.filterList();
  }

  popUserFromSelected(userId: number) {
    this.selectedUsers = this.selectedUsers.filter(user => !this.userIdMatches(user, userId));
  }

  addUserToSelected(userId: number) {
    let selectedUser: User = null;
    this.allUsers.forEach(user => {
      if (user.id === userId) {
        selectedUser = user;
      }
    });
    if (selectedUser !== null) {
      this.selectedUsers.push(selectedUser);
    }
  }

  addUserToUnselected(userId: number) {
    let unselectedUser: User = null;
    this.allUsers.forEach(user => {
      if (user.id === userId) {
        unselectedUser = user;
      }
    });
    if (unselectedUser !== null) {
      this.unselectedUsers.push(unselectedUser);
    }
    this.filterList();
  }

  userIdMatches(user: User, userId: number) {
    if (user.id === userId) {
      console.log('user: ', user);
      console.log('userId: ', userId);
    }
    return user.id === userId;
  }

  filterList() {
    if (this.filter !== '') {
      this.filteredUsers = this.unselectedUsers.filter(item => this.filterTest(item, this.filter));
    } else {
      this.refreshFilteredUsers();
    }
    // if there are users in the list highlightedNotSelectedIds
    // who are not in filteredUsers, need to delete them from highlightedNotSelectedIds
    this.highlightedNotSelectedIds = this.highlightedNotSelectedIds.filter(id => this.userInFilteredUsers(id));
  }

  userInFilteredUsers(id: number) {
    let inList = false;
    this.filteredUsers.forEach(user => {
      if (this.userIdMatches(user, id)) {
        inList = true;
      }
    });
    return inList;
  }

  filterTest(user: User, stringFragment: string) {
    // returns true if the stringFragment is found in the first or last name, or the email address
    return (-1 < user['firstName'].toLowerCase().indexOf(stringFragment.toLowerCase())) ||
      (-1 < user['lastName'].toLowerCase().indexOf(stringFragment.toLowerCase())) ||
      (-1 < user['email'].toLowerCase().indexOf(stringFragment.toLowerCase()));
  }


  onUserSelected(userId: number) {
    console.log('selected user: ', userId);
    this.popUserFromUnselected(userId);
    this.addUserToSelected(userId);
    this.highlightedNotSelectedIds = this.highlightedNotSelectedIds.filter(id => userId !== id);
    this.onChangeOfSelection(); // emit the new set of selected users
  }

  onUserUnselected(userId: number) {
    this.popUserFromSelected(userId);
    this.addUserToUnselected(userId);
    this.highlightedSelectedIds = this.highlightedSelectedIds.filter(id => userId !== id);
    this.onChangeOfSelection(); // emit the new set of selected users
  }

  onUnselectedUserHighlighted(userId: number) {
    this.highlightedNotSelectedIds.push(userId);
  }

  onUnselectedUserUnhighlighted(userId: number) {
    this.highlightedNotSelectedIds = this.highlightedNotSelectedIds.filter(id => userId !== id);
  }

  onSelectedUserHighlighted(userId: number) {
    this.highlightedSelectedIds.push(userId);
  }

  onSelectedUserUnhighlighted(userId: number) {
    this.highlightedSelectedIds = this.highlightedSelectedIds.filter(id => userId !== id);
  }

  usersHighlightedToSelect() {
    return this.highlightedNotSelectedIds.length > 0;
  }

  usersHighlightedToUnselect() {
    return this.highlightedSelectedIds.length > 0;
  }

  setRightArrowHover() {
    this.rightArrowHovered = true;
  }

  setLeftArrowHover() {
    this.leftArrowHovered = true;
  }

  setRightArrowUnhover() {
    this.rightArrowHovered = false;
  }

  setLeftArrowUnhover() {
    this.leftArrowHovered = false;
  }

  onRightArrowClick() {
    if (this.usersHighlightedToSelect()) {
      this.highlightedNotSelectedIds.forEach(userId => this.onUserSelected(userId));
      this.highlightedNotSelectedIds = [];
    }
  }

  onLeftArrowClick() {
    if (this.usersHighlightedToUnselect()) {
      this.highlightedSelectedIds.forEach(userId => this.onUserUnselected(userId));
      this.highlightedSelectedIds = [];
    }
  }

  onChangeOfSelection(){
    this.onSelectionChange.emit(this.selectedUsers);
  }

}
