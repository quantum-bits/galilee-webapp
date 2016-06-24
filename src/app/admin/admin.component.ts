import { Component, OnInit, EventEmitter } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'app-admin',
  templateUrl: 'admin.component.html',
  styleUrls: ['admin.component.css'],
  directives: [ROUTER_DIRECTIVES],
})
export class AdminComponent implements OnInit {

  constructor() {}

  ngOnInit() {
  }

}
