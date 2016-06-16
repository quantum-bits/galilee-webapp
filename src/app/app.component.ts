import { Component, OnInit } from '@angular/core';
import { ReadingService } from './reading.service';
import { Reading } from './reading';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  providers: [ReadingService],
})
export class AppComponent implements OnInit {
  title = 'app works!';

  date: Date;
  readings: Reading[] = [];
  singleReading: Reading;

  public showDetails = true;

  constructor(
    private readingService: ReadingService) {
  }

  ngOnInit() {
    this.date = new Date();
    // FIXME hardcoded readings
    this.readingService.getTodaysReadings().then(
      (readings) => {
        this.readings = readings;
      }
    );
    this.readingService.getSingleReading().then(
      (reading) => {
        this.singleReading = reading;
      }
    );

  }

  toggleDetails() {
    this.showDetails = ! this.showDetails;
  }


}
