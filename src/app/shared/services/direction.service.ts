import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Rx';

import {AuthHttp} from "angular2-jwt";
import {Direction} from "../interfaces/direction.interface";

@Injectable()
export class DirectionService {
  constructor(private authHttp: AuthHttp) {
  }

  createDirection(direction: any, readingId: number, practiceId: number): Observable<Direction> {
    return this.authHttp
      .post('/api/directions', {
        seq: direction.seq,
        readingId: readingId,
        practiceId: practiceId,
        steps: direction.steps
      })
      .map(resp => resp.json());
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
