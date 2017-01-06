import {Component, OnInit, ViewChild} from '@angular/core';

import {ReadingService} from '../../shared/services/reading.service';
import {Reading} from '../../shared/models/reading.model';
import {SimpleModalComponent} from "./simple-modal.component";

@Component({
  selector: 'app-readings',
  templateUrl: './readings.component.html',
  providers: [ReadingService]
})
export class ReadingsComponent implements OnInit {

  // NOTE: to add a modal-type of full view for images, do the following:
  // https://github.com/InfomediaLtd/angular2-materialize/issues/88
  // http://materializecss.com/media.html
  // In particular....
  //ngAfterViewInit(){
  //  $('.materialboxed').materialbox();
  //}


  private readings: Reading[];

  @ViewChild('sorry') modal: SimpleModalComponent;

  constructor(private readingService: ReadingService) {
  }

  // TODO - Don't use a fake date!
  FAKE_DATE: string = '2016-12-28';

  numberReadings: number;
  currentReadingIndex: number; // the index # of the reading that is currently being displayed
  initializationComplete = false;

  ngOnInit() {
    this.readingService.getTodaysReadings(this.FAKE_DATE)
      .subscribe(
        readings => {
          this.readings = readings;
          this.initializeReadingInfo();
        },
        error => {
          this.modal.openModal();
        }
      );
  }

  initializeReadingInfo(){
    this.numberReadings = this.readings.length;
    console.log(this.numberReadings);
    this.currentReadingIndex = 0;
    this.initializationComplete = true;
  }

  onReadingUpdated(updatedReadingIndex: number) {
    console.log('emitted event received!');
    this.currentReadingIndex = updatedReadingIndex;
  }



}
