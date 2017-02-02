import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {Observable} from 'rxjs/Rx';
import {AuthHttp} from 'angular2-jwt';

import {Reading} from '../models/reading.model';
import {ReadingsData} from '../interfaces/readings-data.interface';
import {CalendarEntries} from '../interfaces/calendar-entries.interface';

// TODO: Move this to a shared module.
function todaysDate(): string {
  return new Date().toISOString().substring(0, 10);
}

@Injectable()
export class ReadingService {

  private readingsData: ReadingsData;
  private RCLDate: Date; // keeps track of the RCL date that the user is currently looking at (since this could be different than today's date)

  constructor(private http: Http, private authHttp: AuthHttp) {
  }

  returnTemp() {
    return this.readingsData;
  }

  /* Deprecated -- fetchSavedReadings checks first to see if the readings
                   are in memory; if not, it gets them from the db
  getTodaysReadings(date: string): Observable<Array<Reading>> {//the type is no longer correct here
    //date = date || 'today';
    return this.http
      //.get(`http://localhost:3000/readingday/${date}`)
      .get(`http://localhost:3000/daily/${date}`)
      .map(res => res.json());
  }
  */

  getReadingById(id: number): Observable<Reading> {
    return this.http
      .get(`http://localhost:3000/readings/${id}`)
      .map(res => res.json());
  }

  storeReadings(readingsData: ReadingsData){
    this.readingsData = readingsData;
  }

  getReadingMetadata(): Observable<CalendarEntries> {
    return this.authHttp
      .get('http://localhost:3000/readings/meta')
      .map(resp => resp.json());
  }

  /*
    this method is almost identical to getTodaysReadings, but if the
    data already exists in memory, it returns that data instead of making
    a new trip to the db
  */
  fetchSavedReadings(date: string): Observable<ReadingsData> {
    let dateString: string;
    let savedDateString: string;
    if (typeof this.readingsData === 'undefined') {
      // if readingsData doesn't exist, go get it
      return this.http
        .get(`http://localhost:3000/daily/${date}`)
        .map(res => res.json())
        .do( res => {
          console.log('fetched readings from db');
          this.storeReadings(res); // saving local copy
          return res;
        });
    } else {
      // there is a readingsData object in memory, but is it for the correct date?
      console.log(date);
      if (date === 'today'){
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
          .get(`http://localhost:3000/daily/${date}`)
          .map(res => res.json())
          .do( res => {
            console.log('fetched readings from db');
            this.storeReadings(res); // saving local copy
            return res;
          });
      }
    }
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

}
