import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-practice-item',
  templateUrl: './practice-item.component.html',
  styleUrls: ['./practice-item.component.css']
})
export class PracticeItemComponent implements OnInit {

  @Input() reading: any;
  @Input() practice: any;
  @Input() practiceGeneralInformation: any;

  constructor() {}

  ngOnInit() {
  }

}
