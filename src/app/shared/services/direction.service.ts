import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Rx';

import {AuthHttp} from "angular2-jwt";
import {Direction} from "../interfaces/direction.interface";
import {LicenseType} from "../interfaces/resource.interface";

export const DEFAULT_INFO_URL: string = "https://www.biblegateway.com/resources/scripture-engagement/";
export enum DirectionType {
  reading,
  day
}

const LICENSE_TYPES: LicenseType[] = [
  {
    id: 1,
    name: 'unknown'
  },
  {
    id: 2,
    name: 'Creative Commons'
  },
  {
    id: 3,
    name: 'Public Domain'
  }
]


@Injectable()
export class DirectionService {
  constructor(private authHttp: AuthHttp) {
  }

  createDirection(direction: any, readingOrReadingDayId: number, practiceId: number, directionTypeElement: number): Observable<Direction> {
    if (directionTypeElement === DirectionType.reading) {
      return this.authHttp
        .post('/api/directions/reading', {
          seq: direction.seq,
          readingId: readingOrReadingDayId,
          practiceId: practiceId,
          steps: direction.steps
        })
        .map(resp => resp.json());
    } else if (directionTypeElement === DirectionType.day) {
      return this.authHttp
        .post('/api/directions/day', {
          seq: direction.seq,
          readingDayId: readingOrReadingDayId,
          practiceId: practiceId,
          steps: direction.steps
        })
        .map(resp => resp.json());
    }
  }

  // create multiple directions for a single reading or readingDay
  createMultipleDirections(directions: any[], readingOrReadingDayId: number, practiceIds: number[], directionTypeElement: number): Observable<Array<Direction>> {
    // practiceIds is a list of ids of the same length as the list of
    // directions; it contains the practiceIds for the directions at the corresponding
    // locations in the directions array
    // Note: This is a bit redundant, since the directions contain the practice objects,
    //       which also contain the practice ids, but for consistency, we're following the format for creating a single direction
    //
    let observableBatch = [];
    let i: number = 0;
    if (directionTypeElement === DirectionType.reading) {
      for (let direction of directions) {
        observableBatch.push(
          this.authHttp
            .post('/api/directions/reading', {
              seq: direction.seq,
              readingId: readingOrReadingDayId,
              practiceId: practiceIds[i],
              steps: direction.steps
            })
            .map(resp => resp.json()));
        i++;
      }
    } else if (directionTypeElement === DirectionType.day) {
      for (let direction of directions) {
        observableBatch.push(
          this.authHttp
            .post('/api/directions/day', {
              seq: direction.seq,
              readingDayId: readingOrReadingDayId,
              practiceId: practiceIds[i],
              steps: direction.steps
            })
            .map(resp => resp.json()));
        i++;
      }
    }
    return Observable.forkJoin(observableBatch);
  }



  readDirection(directionId: number): Observable<Direction> {
    return this.authHttp
      .get(`/api/directions/${directionId}`)
      .map(resp => resp.json());
  }

  readAllDirections(): Observable<Array<Direction>> {
    return this.authHttp
      .get('/api/directions')
      .map(resp => resp.json());
  }

  // Currently no Update operation for a direction object.

  deleteDirection(directionId: number): Observable<number> {
    return this.authHttp
      .delete(`/api/directions/${directionId}`)
      .map(resp => resp.json());
  }

  // see: https://stackoverflow.com/questions/35676451/observable-forkjoin-and-array-argument
  deleteMultipleDirections(directionIds: number[]): Observable<Array<number>> {
    let observableBatch = [];
    directionIds.forEach(directionId => {
      observableBatch.push(
        this.authHttp
          .delete(`/api/directions/${directionId}`)
          .map(resp => resp.json()));
    });
    return Observable.forkJoin(observableBatch);
  }

  getAllLicenseTypes(): Observable<Array<LicenseType>> {
    let promise = Promise.resolve(LICENSE_TYPES);
    return Observable.fromPromise(promise);
  }




}
