import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ReadingService} from '../../shared/services/reading.service';
import {Reading} from '../../shared/models/reading.model';
import {SimpleModalComponent} from "./simple-modal.component";

@Component({
  selector: 'app-readings',
  templateUrl: './readings.component.html',
  styleUrls: ['./readings.component.css'],
  providers: [//ReadingService
    ]
})
export class ReadingsComponent implements OnInit {

  // NOTE: to add a modal-type of full view for images, do the following:
  // https://github.com/InfomediaLtd/angular2-materialize/issues/88
  // http://materializecss.com/media.html
  // In particular....
  //ngAfterViewInit(){
  //  $('.materialboxed').materialbox();
  //}


  private readingsData: any;//Reading[];

  @ViewChild('sorry') modal: SimpleModalComponent;

  constructor(private readingService: ReadingService,
              private route: ActivatedRoute) {
  }

  // TODO - Don't use a fake date!
  //FAKE_DATE: string = '2016-12-28';

  dateString: string;
  showPractices: boolean = false;
  //showPracticeDetailPage: boolean = false;
  readingDescriptions: Array<any> = [];//this will hold the reading descriptions for the passages other than the one that is currently being shown
  numberReadings: number;
  currentReadingIndex: number; // the index # of the reading that is currently being displayed
  currentPracticeIndex: number = 0;
  initializationComplete = false;

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log('readings -- received route params');
      this.dateString = params['dateString'];
      this.readingService.getTodaysReadings(this.dateString)
        .subscribe(
          readings => {
            this.readingsData = readings;
            this.initializeReadingInfo();
            this.readingService.storeReadings(this.readingsData);
          },
          error => {
            this.modal.openModal();
          }
        );
    });
  }

  initializeReadingInfo(){
    console.log('inside initializeReadingInfo');
    this.numberReadings = this.readingsData.readings.length;
    console.log(this.numberReadings);
    this.currentReadingIndex = 0;
    this.updateReadingDescriptionMenu();
    this.initializationComplete = true;
  }

  updateReadingDescriptionMenu(){
    this.readingDescriptions = [];
    var loopIndex = 0;
    for (var reading of this.readingsData.readings){
      if (loopIndex != this.currentReadingIndex){
        this.readingDescriptions.push(
          {
            'description': this.readingsData.readings[loopIndex].std_ref,
            'index': loopIndex
          }
        );
      }
      loopIndex++;
    }
    console.log(this.readingDescriptions);
  }

  onReadingUpdated(updatedReadingIndex: number) {
    //console.log('emitted event received!');
    this.currentReadingIndex = updatedReadingIndex;
    this.updateReadingDescriptionMenu();
  }

  /*
  onPracticeUpdated(updatedPracticeIndex: number) {
    console.log('emitted event received!');
    console.log(this.currentPracticeIndex);
    console.log(updatedPracticeIndex);
    console.log(typeof this.currentPracticeIndex);
    console.log(typeof updatedPracticeIndex);
    this.currentPracticeIndex = updatedPracticeIndex;
    this.showPracticeDetailPage = true;
  }
  */


}
