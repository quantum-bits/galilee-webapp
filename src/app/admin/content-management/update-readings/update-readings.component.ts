import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Subscription}   from 'rxjs/Subscription';

import * as moment from 'moment';

import {IReading, ReadingDay} from '../../../shared/interfaces/reading.interface';

import {ReadingService} from '../../../shared/services/reading.service';
import {ReadingDayService} from '../../../shared/services/reading-day.service';

import {CalendarEntries} from '../../../shared/interfaces/calendar-entries.interface';

import {UpdateReadingDayNameModalComponent} from '../update-reading-day-name-modal/update-reading-day-name-modal.component';

@Component({
  selector: 'app-update-readings',
  templateUrl: './update-readings.component.html',
  styleUrls: ['./update-readings.component.css']
})
export class UpdateReadingsComponent implements OnInit, OnDestroy {

  @ViewChild('updateReadingDayModal') updateReadingDayModal: UpdateReadingDayNameModalComponent;

  private calendarReadings: CalendarEntries = {};
  private readingsData: ReadingDay = null;
  private dateString: string = null;

  private reading: IReading = null;

  private dateStringCalendarInit = moment(new Date()).format('YYYY-MM-DD');

  subscription: Subscription;

  constructor(private readingService: ReadingService,
              private readingDayService: ReadingDayService,
              private route: ActivatedRoute,
              private router: Router) {
    this.subscription = this.readingService.updateReadingsRefresh$.subscribe(
      message => {
        console.log('received instructions to refresh!');
        if (this.dateString !== null) {
          this.reloadPageData(this.dateString);
        }
      });
  }

  //},
  //private practiceService: PracticeService) { }

  ngOnInit() {
    this.readingService.getReadingMetadata()
      .subscribe(
        calendarReadings => {
          console.log(calendarReadings);
          this.calendarReadings = calendarReadings;
          this.route.params.subscribe(params => {
            console.log('update-readings -- received route params');
            if ('dateString' in params) {
              this.dateString = params['dateString'];
              this.fetchReadings(this.dateString);
            }
          });
        },
        error => {
          console.log('error: ', error);
        }
      );
  }

  reloadPageData(dateString: string) {
    this.readingService.getReadingMetadata()
      .subscribe(
        calendarReadings => {
          console.log(calendarReadings);
          this.calendarReadings = calendarReadings;
          this.fetchReadings(dateString);
        },
        error => {
          console.log('error: ', error);
        }
      );
  }

  calendarInit() {
    if (this.dateString !== null) {
      return this.dateString;
    } else {
      return this.dateStringCalendarInit;
    }
  }

  editReadingDayName() {
    this.updateReadingDayModal.openModal(this.dateString, false, this.readingsData.name);
  }

  getReadingDayModalObject(readingDayObject: any) {
    if (readingDayObject.isCreatingNewDay) {
      this.createNewReadingDay(readingDayObject.name, readingDayObject.date);
    } else {
      this.readingsData.name = readingDayObject.name;
      this.updateReadingDay(this.readingsData);
    }

  }

  updateReadingDay(readingDay: ReadingDay) {
    this.readingDayService.updateReadingDay(readingDay)
      .subscribe(
        result => { },
        error => {
          console.log("Error updating reading day", error);
        }
      )
  }

  createNewReadingDay(readingDayName: string, dateString: string) {
      let readingDay: ReadingDay = {
        id: null,
        date: dateString,
        name: readingDayName,
        directions: [],
        readings: []
      };
      this.readingDayService.createReadingDay(readingDay)
        .subscribe(
          result => {
            console.log('new readingDay created: ', result);
            // now need to update the calendarReadings....; this is not done
            // automatically, since ngOnInit only gets run when the page is
            // initially loaded; also, can't just launch readingService.announceReadingsRefresh(),
            // since we're actually going to a different day....
            this.readingService.getReadingMetadata()
              .subscribe(
                calendarReadings => {
                  console.log(calendarReadings);
                  this.calendarReadings = calendarReadings;
                  // now can reload the page
                  this.router.navigate(['/admin/update-readings', this.dateString]);
                },
                error => {
                  console.log('error trying to load calendar readings....', error);
                });
          },
          error => {
            console.log('error trying to create new readingDay', error);
          }
        );
  }

  daySelected(dateString: string) {
    // do something....
    console.log('dateString: ', dateString);
    this.dateString = dateString;
    if (dateString in this.calendarReadings) {
      console.log('we have a reading for this day!');
      this.router.navigate(['/admin/update-readings', this.dateString]);
    } else {
      console.log('no readings for this day; creating one....');
      this.createNewReadingDay('', this.dateString);
      // uncomment the following line (and comment out the above one) to force the user to assign a
      // name to the reading day as part of the process of creating it
      //this.updateReadingDayModal.openModal(this.dateString, true);
    }
  }

  fetchReadings(dateString: string) {
    this.readingService.dumpStoredReadings();
    this.readingService.fetchSavedReadings(dateString)
      .subscribe(
        readings => {
          this.readingsData = readings;
          console.log('READINGS: ', this.readingsData);
        },
        error => {
          //this.modal.openModal();
          console.log('error: ', error);
          this.readingsData = null;
          /*
           if 404 error, immediately create a new readingDay object
           in the database, wait for the reply, and then set readingsData to the response;
           then it will be ready for posting questions/readings, etc.
           */


        }
      );
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }


}
