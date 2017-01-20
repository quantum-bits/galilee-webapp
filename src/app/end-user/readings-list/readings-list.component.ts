import { Component, OnInit, Input, ViewChild, OnChanges } from '@angular/core';

import * as moment from 'moment';

import {SimpleModalComponent} from "../readings/simple-modal.component";

import {ReadingService} from '../../shared/services/reading.service';


@Component({
  selector: 'app-readings-list',
  templateUrl: './readings-list.component.html',
  styleUrls: ['./readings-list.component.css']
})
export class ReadingsListComponent implements OnInit, OnChanges {

  @Input() dateString: string;

  @ViewChild('sorry') modal: SimpleModalComponent;

  private readingsData: any;

  constructor(private readingService: ReadingService) { }

  ngOnInit() {
    console.log('inside readings-list oninit');
  }

  fetchReadings(){
    this.readingService.fetchSavedReadings(this.dateString)
      .subscribe(
        readingsData => {
          this.readingsData = readingsData;
        },
        error => {
          this.readingsData = undefined;
          this.modal.openModal('', 'No readings for '+this.dateString);
        }
      );
  }

  ngOnChanges() {
    console.log('change detected!');
    this.fetchReadings();
  }

}
