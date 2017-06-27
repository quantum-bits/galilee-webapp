import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {User} from '../../../shared/models/user.model';


@Component({
  selector: 'app-user-entry',
  templateUrl: './user-entry.component.html',
  styleUrls: ['./user-entry.component.scss']
})
export class UserEntryComponent implements OnInit {

  @Input() user: User;
  @Output() onSelected = new EventEmitter<number>();
  @Output() onHighlighted = new EventEmitter<number>();
  @Output() onUnhighlighted = new EventEmitter<number>();

  isHovered: boolean = false;
  isHighlighted: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  setHover() {
    this.isHovered = true;
  }

  setUnhover() {
    this.isHovered = false;
  }

  selectUser() {
    this.onSelected.emit(this.user.id);
  }

  toggleHighlightUser() {
    if (!this.isHighlighted) {
      this.onHighlighted.emit(this.user.id);
    } else {
      this.onUnhighlighted.emit(this.user.id);
    }
    this.isHighlighted = !this.isHighlighted;
  }

}
