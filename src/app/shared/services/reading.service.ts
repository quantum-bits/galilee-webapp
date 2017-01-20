import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {Observable} from 'rxjs/Rx';

import {Reading} from '../models/reading.model';

function todaysDate(): string {
  return new Date().toISOString().substring(0, 10);
}

@Injectable()
export class ReadingService {

  readingsData: any;
  private RCLDate: Date; // keeps track of the RCL date that the user is currently looking at (since this could be different than today's date)

  constructor(private http: Http) {
  }

  getTodaysReadings(date: string): Observable<Array<Reading>> {//the type is no longer correct here
    //date = date || 'today';
    return this.http
      //.get(`http://localhost:3000/readingday/${date}`)
      .get(`http://localhost:3000/daily/${date}`)
      .map(res => res.json());
  }

  getReadingById(id: number): Observable<Reading> {
    return this.http
      .get(`http://localhost:3000/reading/${id}`)
      .map(res => res.json());
  }

  storeReadings(readingsData: any){
    this.readingsData = readingsData;
    console.log('readings:');
    console.log(this.readingsData);
  }



  /*
   getPermissionTypes() {
   var promise = Promise.resolve(PERMISSION_TYPES);// Observable.just(USERS);
   return Observable.fromPromise(promise);
   }
   */



  /*
    this method is almost identical to getTodaysReadings, but if the
    data already exists in memory, it returns that data instead of making
    a new trip to the db
  */
  fetchSavedReadings(date: string): Observable<Array<Reading>> {
    let dateString: string;
    let savedDateString: string;
    if (typeof this.readingsData === 'undefined') {
      // if readingsData doesn't exist, go get it
      return this.http
        .get(`http://localhost:3000/daily/${date}`)
        .map(res => res.json());
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
        var promise = Promise.resolve(this.readingsData);
        return Observable.fromPromise(promise);
      } else {
        // date mismatch; fetch data from the db....
        return this.http
          .get(`http://localhost:3000/daily/${date}`)
          .map(res => res.json());
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
