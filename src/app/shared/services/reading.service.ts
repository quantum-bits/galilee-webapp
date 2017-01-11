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

  constructor(private http: Http) {
  }

  getTodaysReadings(date?: string): Observable<Array<Reading>> {//the type is no longer correct here
    //date = date || todaysDate();
    date = date || 'today';
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

  stepExists(readingIndex: number, practiceIndex: number, stepIndex: number){
    // checks whether a step exists for the specified practice and reading
    // http://stackoverflow.com/questions/5113374/javascript-check-if-variable-exists-is-defined-initialized
    console.log('inside stepExists method');
    console.log(this.readingsData);
    if (typeof this.readingsData === 'undefined') {
      // the readings have not yet been defined
      return false;
    } else if (readingIndex >= this.readingsData.length) {
      return false;
    } else if (practiceIndex >= this.readingsData.readings[readingIndex].applications.length) {
      return false;
    } else { // still need to check the steps....
      return true;
    }
  }

  fetchSavedReading(readingIndex: number) {
    // double-check that the reading exists, etc.
    if ((typeof this.readingsData === 'undefined')||(readingIndex >= this.readingsData.length)) {
      return [];
    } else {
      //console.log(this.readingsData.readings[readingIndex]);
      return this.readingsData.readings[readingIndex];
    }
  }

}
