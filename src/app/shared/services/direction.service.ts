import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Rx';

import {AuthHttp} from "angular2-jwt";
import {Direction} from "../interfaces/direction.interface";

export const DEFAULT_INFO_URL: string = "https://www.biblegateway.com/resources/scripture-engagement/";
export enum DirectionType {
  reading,
  day
}

@Injectable()
export class DirectionService {
  constructor(private authHttp: AuthHttp) {
  }

  createDirection(direction: any, readingOrReadingDayId: number, practiceId: number, directionType: number): Observable<Direction> {
    if (directionType === DirectionType.reading) {
      return this.authHttp
        .post('/api/directions/reading', {
          seq: direction.seq,
          readingId: readingOrReadingDayId,
          practiceId: practiceId,
          steps: direction.steps
        })
        .map(resp => resp.json());
    } else if (directionType === DirectionType.day) {
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

  // Currently no Update operation for an direction object.

  deleteDirection(directionId: number): Observable<number> {
    return this.authHttp
      .delete(`/api/directions/${directionId}`)
      .map(resp => resp.json());
  }
}
