import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Rx';

import {Practice} from '../models/practice.model';
import {AuthHttp} from "angular2-jwt";
import {IPractice} from "../interfaces/practice.interface";

@Injectable()
export class PracticeService {
  constructor(private authHttp: AuthHttp) {
  }

  createPractice(practice: IPractice): Observable<IPractice> {
    return this.authHttp
      .post('/api/practices', {
        title: practice.title,
        description: practice.description,
        summary: practice.summary
      })
      .map(resp => resp.json());
  }

  readPractice(practiceId: number): Observable<IPractice> {
    return this.authHttp
      .get(`/api/practices/${practiceId}`)
      .map(resp => resp.json());
  }

  readAllPractices(): Observable<Array<IPractice>> {
    return this.authHttp
      .get('/api/practices')
      .map(resp => resp.json());
  }

  updatePractice(practice: IPractice): Observable<IPractice> {
    return this.authHttp
      .patch(`/api/practices/${practice.id}`, {
        title: practice.title,
        description: practice.description,
        summary: practice.summary
      })
      .map(resp => resp.json());
  }

  deletePractice(practiceId: number): Observable<number> {
    return this.authHttp
      .delete(`/api/practices/${practiceId}`)
      .map(resp => resp.json());
  }

}
