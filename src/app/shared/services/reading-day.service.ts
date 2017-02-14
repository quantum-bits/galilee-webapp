import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Rx';

import {AuthHttp} from "angular2-jwt";
import {ReadingDay} from "../interfaces/reading.interface";

@Injectable()
export class ReadingDayService {
  constructor(private authHttp: AuthHttp) {
  }

  createReadingDay(readingDay: ReadingDay): Observable<ReadingDay> {
    return this.authHttp
      .post('/api/readingdays', {
        date: readingDay.date,
        name: readingDay.name
      })
      .map(resp => resp.json());
  }

  readReadingDay(readingDayId: number): Observable<ReadingDay> {
    return this.authHttp
      .get(`/api/readingdays/${readingDayId}`)
      .map(resp => resp.json());
  }

  readAllReadingDays(): Observable<Array<ReadingDay>> {
    return this.authHttp
      .get('/api/readingdays')
      .map(resp => resp.json());
  }

  updateReadingDay(readingDay: ReadingDay): Observable<ReadingDay> {
    return this.authHttp
      .patch(`/api/readingdays/${readingDay.id}`, {
        date: readingDay.date,
        name: readingDay.name
      })
      .map(resp => resp.json());
  }

  deleteReadingDay(readingDayId: number): Observable<number> {
    return this.authHttp
      .delete(`/api/readingdays/${readingDayId}`)
      .map(resp => resp.json());
  }

}
