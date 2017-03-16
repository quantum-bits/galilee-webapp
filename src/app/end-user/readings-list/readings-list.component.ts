import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as moment from 'moment';

import {ReadingDay} from '../../shared/interfaces/reading.interface';
import {ReadingService} from '../../shared/services/reading.service';


@Component({
  selector: 'app-readings-list',
  templateUrl: './readings-list.component.html',
  styleUrls: ['./readings-list.component.css']
})
export class ReadingsListComponent implements OnInit {

  @Input() dateString: string;
  @Input() readingsData: ReadingDay;
  @Input() includeLinkToReadings: string;
  @Output() openReadings = new EventEmitter();

  constructor(){} //private readingService: ReadingService) { }

  ngOnInit() {
    console.log('inside readings-list oninit');
  }

  goToReadings(readingIndex: number) {
    this.openReadings.emit(readingIndex)
  }

}
