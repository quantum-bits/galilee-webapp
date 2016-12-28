import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {Observable} from 'rxjs/Rx';

import {Reading} from '../models/reading.model';

const READINGS = [];   // DELETE ME

@Injectable()
export class ReadingService {
  reading: string;    // DELETE ME

  constructor(private http: Http) {
  }

  getTodaysReadings(): Observable<Array<Reading>> {
    return this.http
      .get('http://localhost:3000/readings')
      .map(res => res.json());
  }

  getSingleReading() {
    return Promise.resolve(READINGS[0]);
  }

  getReading(id: number) {// typescript for loop: https://basarat.gitbooks.io/typescript/content/docs/for...of.html
    for (var readingItem of READINGS) {
      if (readingItem.id === id) {
        this.reading = readingItem;
      }
    }
    //FIXME convert to Observable
    return Promise.resolve(
      this.reading //FIXME need to add error trapping!
    );
    /*
     this.getTodaysReadings()
     .then(readings => {
     readings.filter(reading => reading.id === id)[0];
     console.log('hey, i got here');
     });
     */
  }

  getTodaysReadingsAsObservable() {
    var promise = Promise.resolve(READINGS);// Observable.just(READINGS);
    return Observable.fromPromise(promise);
    //return Observable.from(READINGS); // using from sends them back as four packages or something...?
  }

}
