import { Component, OnInit } from '@angular/core';

//import {ReadingService} from '../../../shared/services/reading-service';
import {ReadingService} from '../../../shared/services/reading.service';
import {CalendarEntries} from '../../../shared/interfaces/calendar-entries.interface';

@Component({
  selector: 'app-update-readings',
  templateUrl: './update-readings.component.html',
  styleUrls: ['./update-readings.component.css']
})
export class UpdateReadingsComponent implements OnInit {

  private calendarReadings: CalendarEntries;

  constructor(private readingService: ReadingService) { }

  ngOnInit() {
    this.readingService.fetchCalendarReadings()
      .subscribe(
        calendarReadings => {
          console.log(calendarReadings);
          this.calendarReadings = calendarReadings;
        }
      )
  }

  daySelected(dateString: string) {
    // do something....
    console.log('dateString: ', dateString);

    /*
    let journalEntryQueryFilters: JournalEntryQueryFilters = {
      'date': dateString
    };
    let navigationExtras: NavigationExtras = {
      queryParams: journalEntryQueryFilters
    };
    this.router.navigate(['/end-user/journal/search-results'], navigationExtras);
    */
  }





}
