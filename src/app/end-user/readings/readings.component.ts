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

  ngOnInit() {
    this.readingService.getTodaysReadings()
      .subscribe(
        readings => this.readings = readings,
        error => {
          this.modal.openModal();
        });
  }
}
