import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-practice-list',
  templateUrl: './practice-list.component.html',
  styleUrls: ['./practice-list.component.css']
})
export class PracticeListComponent implements OnInit {

  @Input() reading: any;

  constructor() { }

  ngOnInit() {
    console.log(this.reading);
  }

}
