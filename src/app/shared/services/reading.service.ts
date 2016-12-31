import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {Observable} from 'rxjs/Rx';
import {Reading} from '../models/reading.model';

function todaysDate(): string {
  return new Date().toISOString().substring(0, 10);
}

@Injectable()
export class ReadingService {
  constructor(private http: Http) {
  }

  getTodaysReadings(date?: string): Observable<Array<Reading>> {
    date = date || todaysDate();
    return this.http
      .get(`http://localhost:3000/readingday/${date}`)
      .map(res => res.json());
  }

  getReadingById(id: number): Observable<Reading> {
    return this.http
      .get(`http://localhost:3000/reading/${id}`)
      .map(res => res.json());
  }

}
