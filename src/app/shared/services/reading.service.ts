import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {Observable} from 'rxjs/Rx';
import {Subject}    from 'rxjs/Subject';
import {AuthHttp} from 'angular2-jwt';

import {Reading} from '../models/reading.model';
import {ReadingDay, DailyQuestion, IReading} from '../interfaces/reading.interface';
import {CalendarEntries} from '../interfaces/calendar-entries.interface';

// TODO: Move this to a shared module.
function todaysDate(): string {
  return new Date().toISOString().substring(0, 10);
}

@Injectable()
export class ReadingService {

  private readingsData: ReadingDay = null;
  private RCLDate: Date; // keeps track of the RCL date that the user is currently looking at (since this could be different than today's date)

  // Observable string source; used for various subcomponents to inform
  // update-readings that readings have been updated in the db and it is
  // time to refetch data
  private updateReadingsRefreshSource = new Subject();

  // Observable string stream
  updateReadingsRefresh$ = this.updateReadingsRefreshSource.asObservable();

  constructor(private http: Http, private authHttp: AuthHttp) {
  }

  returnTemp() {
    return this.readingsData;
  }

  getReadingById(id: number): Observable<Reading> {
    return this.http
      .get(`/api/readings/${id}`)
      .map(res => res.json());
  }

  storeReadings(readingsData: ReadingDay) {
    this.readingsData = readingsData;
  }

  dumpStoredReadings() {
    this.readingsData = null;
  }

  getReadingMetadata(): Observable<CalendarEntries> {
    return this.authHttp
      .get('/api/readings/meta')
      .map(resp => resp.json());
  }

  /*
   this method is almost identical to getTodaysReadings, but if the
   data already exists in memory, it returns that data instead of making
   a new trip to the db
   */
  fetchSavedReadings(date: string): Observable<ReadingDay> {
    let dateString: string;
    let savedDateString: string;
    if (this.readingsData === null) {
      // if readingsData doesn't exist, go get it
      return this.http
        .get(`/api/daily/${date}`)
        .map(res => res.json())
        .do(res => {
          console.log('fetched readings from db');
          this.storeReadings(res); // saving local copy
          return res;
        });
    } else {
      // there is a readingsData object in memory, but is it for the correct date?
      console.log(date);
      if (date === 'today') {
        dateString = todaysDate();
      } else {
        dateString = date;
      }
      savedDateString = this.readingsData.date.substring(0, 10);
      if (savedDateString === dateString) {
        // the requested date and the saved date agree; return the saved data....
        console.log('fetched readings from saved copy');
        var promise = Promise.resolve(this.readingsData);
        return Observable.fromPromise(promise);
      } else {
        // date mismatch; fetch data from the db....
        return this.http
          .get(`/api/daily/${date}`)
          .map(res => res.json())
          .do(res => {
            console.log('fetched readings from db');
            this.storeReadings(res); // saving local copy
            return res;
          });
      }
    }
  }

  // Service message command
  announceReadingsRefresh() {
    this.dumpStoredReadings();
    this.updateReadingsRefreshSource.next('time to refresh data');
  }

  setRCLDate(date: Date) {
    this.RCLDate = date;
  }

  fetchRCLDate(): Date {
    return this.RCLDate;
  }

  RCLDateIsSet(): boolean {
    if (this.RCLDate !== undefined) {
      return true;
    } else {
      return false;
    }
  }

  createReading(reading: IReading, readingDay: ReadingDay): Observable<IReading> {
    return this.authHttp.post('/api/readings', {
      seq: reading.seq,
      stdRef: reading.stdRef,
      osisRef: reading.osisRef,
      readingDayId: readingDay.id
    }).map(resp => resp.json());
  }

  readReading(readingId: number): Observable<IReading> {
    return this.authHttp
      .get(`/api/readings/${readingId}`)
      .map(resp => resp.json());
  }

  updateReading(readingId: number, reading: IReading, readingDay: ReadingDay): Observable<IReading> {
    return this.authHttp
      .patch(`/api/readings/${readingId}`, {
        seq: reading.seq,
        stdRef: reading.stdRef,
        osisRef: reading.osisRef,
      })
      .map(resp => resp.json());
  }

  deleteReading(readingId: number): Observable<number> {
    return this.authHttp
      .delete(`/api/readings/${readingId}`)
      .map(resp => resp.json());
  }

}
