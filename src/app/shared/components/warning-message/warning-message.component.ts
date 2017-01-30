import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-warning-message',
  templateUrl: './warning-message.component.html',
  styleUrls: ['./warning-message.component.css']
})
export class WarningMessageComponent implements OnInit {

  @Input() warning: string;
  constructor() { }

  ngOnInit() {
  }

}
