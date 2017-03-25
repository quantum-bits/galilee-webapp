import { Directive, OnInit, AfterViewInit } from '@angular/core';

import {DateNavSpyService} from "../services/date-nav-spy.service";


//https://angular.io/docs/ts/latest/guide/lifecycle-hooks.html
// Spy on any element to which it is applied.
// Usage: <div appSpy>...</div>

@Directive({
  selector: '[appSpy]'
})
export class SpyDirective implements OnInit, AfterViewInit {

  constructor(private dateNavSpyService: DateNavSpyService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    console.log('SPY: afterViewInit');
    this.dateNavSpyService.broadcastDateNavUpdate();
  }

}
