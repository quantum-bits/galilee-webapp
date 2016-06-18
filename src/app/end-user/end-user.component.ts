import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'app-end-user',
  templateUrl: 'end-user.component.html',
  styleUrls: ['end-user.component.css'],
  directives: [ROUTER_DIRECTIVES],
})
export class EndUserComponent implements OnInit {

  constructor() {}

  ngOnInit() {
  }

}
