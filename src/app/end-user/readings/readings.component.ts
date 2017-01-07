import {Component, OnInit, ViewChild} from '@angular/core';

import {ReadingService} from '../../shared/services/reading.service';
import {Reading} from '../../shared/models/reading.model';
import {SimpleModalComponent} from "./simple-modal.component";

@Component({
  selector: 'app-readings',
  templateUrl: './readings.component.html',
  styleUrls: ['./readings.component.css'],
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

  readingDescriptions: Array<any> = [];//this will hold the reading descriptions for the passages other than the one that is currently being shown
  numberReadings: number;
  currentReadingIndex: number; // the index # of the reading that is currently being displayed
  initializationComplete = false;

  ngOnInit() {
    this.readingService.getTodaysReadings(this.FAKE_DATE)
      .subscribe(
        readings => {
          this.readings = readings;
          this.initializeReadingInfo();
          console.log(this.readings);
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
    this.updateReadingDescriptionMenu();
    this.initializationComplete = true;
    /*
    this.readingDescriptions = [];
    var loopIndex = 0;
    for (var reading of this.readings){
      if (loopIndex != this.currentReadingIndex){
        this.readingDescriptions.push(
          {
            'description': this.readings[loopIndex].description,
            'index': loopIndex
          }
          );
      }
      loopIndex++;
    }
    //console.log(this.readingDescriptions);
    */
  }

  updateReadingDescriptionMenu(){
    this.readingDescriptions = [];
    var loopIndex = 0;
    for (var reading of this.readings){
      if (loopIndex != this.currentReadingIndex){
        this.readingDescriptions.push(
          {
            'description': this.readings[loopIndex].description,
            'index': loopIndex
          }
        );
      }
      loopIndex++;
    }
    //console.log(this.readingDescriptions);
  }

  onReadingUpdated(updatedReadingIndex: number) {
    console.log('emitted event received!');
    this.currentReadingIndex = updatedReadingIndex;
    this.updateReadingDescriptionMenu();
  }



}
